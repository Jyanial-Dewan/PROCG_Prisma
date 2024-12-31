const prisma = require("../DB/db.config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

//Generate access token and refresh token
const generateAccessTokenAndRefreshToken = (props) => {
  const accessToken = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRED_TIME,
  });
  const refreshToken = jwt.sign(props, JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRED_TIME,
  });
  return { accessToken, refreshToken };
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  //------------------ Verify password
  const verifyPassword = (storedData, password) => {
    return new Promise((resolve, reject) => {
      const [, digest, iterations, salt, storedHash] = storedData.split(/[:$]/);

      const iterationsNumber = parseInt(iterations, 10);

      crypto.pbkdf2(
        password,
        salt,
        iterationsNumber,
        32,
        digest,
        (err, derivedKey) => {
          if (err) return reject(err);

          const isMatch = storedHash === derivedKey.toString("hex");
          resolve(isMatch);
        }
      );
    });
  };
  //-------------------------
  try {
    const user = await prisma.def_users.findFirst({
      where: {
        email_addresses: {
          array_contains: email,
        },
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found." });
    } else {
      const userCredential = await prisma.def_user_credentials.findUnique({
        where: {
          user_id: user.user_id,
        },
      });
      const passwordResult = await verifyPassword(
        userCredential.password,
        password
      );
      if (!passwordResult) {
        return res.status(401).json({ message: "Invalid password." });
      }
      console.log({ passwordResult });
      // const encryptedPassword = hashPassword(password);
      if (userCredential && passwordResult) {
        // if (userCredential && userCredential.password === encryptedPassword) {
        const { accessToken, refreshToken } =
          generateAccessTokenAndRefreshToken({
            isLoggedIn: true,
            user_id: user.user_id,
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            issuedAt: new Date(),
          });

        return res
          .status(200)
          .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: false,
          })
          .json({
            isLoggedIn: true,
            user_id: user.user_id,
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            access_token: accessToken,
            refresh_token: refreshToken,
            issuedAt: new Date(),
          });
      } else {
        return res.status(401).json({ message: "Invalid credential" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//User
exports.user = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// refresh token
exports.refreshToken = async (req, res) => {
  const refreshTokenValue =
    req.cookies?.refresh_token ||
    req.body?.refresh_token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!refreshTokenValue) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    jwt.verify(
      refreshTokenValue,
      JWT_SECRET_REFRESH_TOKEN,
      async (err, user) => {
        if (err) {
          //if token expired
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .clearCookie("access_token")
              .clearCookie("refresh_token")
              .json({ message: "Unauthorized Access: Token has expired" });
          }
          //if token is invalid
          return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        const response = await prisma.def_users.findUnique({
          where: {
            user_id: user?.user_id,
          },
        });
        if (!response) {
          return res
            .status(401)
            .json({ message: "Invalid or expired refresh token" });
        }
        // Generate new access token and refresh token
        const { accessToken, refreshToken } =
          generateAccessTokenAndRefreshToken({
            isLoggedIn: true,
            user_id: user.user_id,
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            issuedAt: new Date(),
          });

        return res
          .status(200)
          .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: false,
          })
          .json({
            isLoggedIn: true,
            user_id: user.user_id,
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            access_token: accessToken,
            refresh_token: refreshToken,
            issuedAt: new Date(),
          });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Invalid or expired refresh token" });
  }
};

// Social Login---------START
// google login
const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
const ACCESS_TOKEN_EXPIRED_TIME = process.env.ACCESS_TOKEN_EXPIRED_TIME;
const REFRESH_TOKEN_EXPIRED_TIME = process.env.REFRESH_TOKEN_EXPIRED_TIME;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

const REDIRECT_APP_URL = process.env.REDIRECT_APP_URL;
const downloadAndSaveImage = require("../Middleware/multerDownloadImage");

// Step 1: Google Login URL
exports.googleLogin = (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;
  res.redirect(googleAuthUrl);
};

// Step 2: Handle Google Callback
exports.googleCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { access_token } = data;
    const profile = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const userEmail = profile.data.email;

    // Check if user exists, else create
    let user = await prisma.def_users.findFirst({
      where: {
        email_addresses: {
          array_contains: userEmail,
        },
      },
    });

    if (!user) {
      const maxUserIDResult = await prisma.def_users.aggregate({
        _max: {
          user_id: true,
        },
      });
      const baseUserName = profile.data.name.split(" ").join("").toLowerCase();

      let userName = baseUserName;

      // Check if the username exists
      const existingUser = await prisma.def_users.findFirst({
        where: { user_name: userName },
      });

      if (existingUser) {
        userName = `${baseUserName}${1}`;
      }

      const savedFilePath = await downloadAndSaveImage(
        profile.data.picture,
        userName
      );

      // console.log(savedFilePath, "savedFilePath");
      const currentTime = new Date();
      const maxID = maxUserIDResult._max.user_id + 1;
      user = await prisma.def_users.create({
        data: {
          user_id: maxID,
          user_name: userName,
          user_type: "person",
          email_addresses: [userEmail],
          created_by: 99,
          created_on: currentTime.toLocaleString(),
          last_updated_by: 99,
          last_updated_on: currentTime.toLocaleString(),
          tenant_id: 1,
          profile_picture: savedFilePath,
        },
      });
      await prisma.def_persons.create({
        data: {
          user_id: maxID,
          first_name: profile.data.given_name,
          middle_name: "",
          last_name: profile.data.family_name,
          job_title: "Google Visitor",
        },
      });

      await prisma.def_user_credentials.create({
        data: {
          user_id: maxID,
          password: crypto.randomBytes(64).toString("hex"),
        },
      });
    }

    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
      isLoggedIn: true,
      user_id: user.user_id,
      user_type: user.user_type,
      user_name: user.user_name,
      tenant_id: user.tenant_id,
      issuedAt: new Date(),
    });

    res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .redirect(
        `${REDIRECT_APP_URL}?user_id=${user.user_id}&email=${userEmail}&access_token=${accessToken}`
      );
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Field to create user via Google account." })
        .redirect(`${REDIRECT_APP_URL}/login`);
    }
  }
};

// Step 1: GitHub Login URL
exports.githubLogin = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
  res.redirect(githubAuthUrl);
};

// Step 2: Handle GitHub Callback
exports.githubCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        code,
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        redirect_uri: GITHUB_REDIRECT_URI,
      },
      { headers: { Accept: "application/json" } }
    );

    const { access_token } = data;
    const profile = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userEmail = profile.data.email;
    // console.log(userEmail, "userEmail", profile.data, "data");
    // Check if user exists, else create
    let user = await prisma.def_users.findFirst({
      where: {
        email_addresses: {
          array_contains: userEmail,
        },
      },
    });

    if (!user) {
      const maxUserIDResult = await prisma.def_users.aggregate({
        _max: {
          user_id: true,
        },
      });
      const baseUserName = profile.data.login;

      let userName = baseUserName;

      // Check if the username exists
      const existingUser = await prisma.def_users.findFirst({
        where: { user_name: userName },
      });

      if (existingUser) {
        userName = `${baseUserName}${1}`;
      }

      const savedFilePath = await downloadAndSaveImage(
        profile.data.avatar_url,
        userName
      );

      // console.log(savedFilePath, "savedFilePath");
      const currentTime = new Date();
      const maxID = maxUserIDResult._max.user_id + 1;
      user = await prisma.def_users.create({
        data: {
          user_id: maxID,
          user_name: userName,
          user_type: "person",
          email_addresses: [userEmail],
          created_by: 100,
          created_on: currentTime.toLocaleString(),
          last_updated_by: 100,
          last_updated_on: currentTime.toLocaleString(),
          tenant_id: 1,
          profile_picture: savedFilePath,
        },
      });
      await prisma.def_persons.create({
        data: {
          user_id: maxID,
          first_name: profile.data.name.split(" ")[0],
          middle_name: "",
          last_name: profile.data.name.split(" ")[1],
          job_title: "GitHubVisitor",
        },
      });

      await prisma.def_user_credentials.create({
        data: {
          user_id: maxID,
          password: crypto.randomBytes(64).toString("hex"),
        },
      });
    }

    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
      isLoggedIn: true,
      user_id: user.user_id,
      user_type: user.user_type,
      user_name: user.user_name,
      tenant_id: user.tenant_id,
      issuedAt: new Date(),
    });

    res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .redirect(
        `${REDIRECT_APP_URL}?user_id=${user.user_id}&email=${userEmail}&access_token=${accessToken}`
      );
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Field to create user via GitHub account." })
        .redirect(`${REDIRECT_APP_URL}/login`);
    }
  }
};
// Social Login---------END
