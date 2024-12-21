const prisma = require("../DB/db.config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
const generateAccessTokenAndRefreshToken = (props) => {
  const accessToken = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign(props, JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "33m",
  });
  return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

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
      res.status(404).json({ error: "User not found." });
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
            // maxAge: 20 * 60 * 1000, // 7 days
          })
          .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: false,
            // maxAge: 15 * 1000, // 15 minutes
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
        return res.status(401).json({ error: "Invalid credential" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json("Logged out successfully");
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
  const refreshTokenValue = req.cookies.refresh_token || req.body.refresh_token;
  if (!refreshTokenValue) {
    return res.status(401).json({ error: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshTokenValue, JWT_SECRET_REFRESH_TOKEN);
    const user = await prisma.def_users.findUnique({
      where: {
        user_id: decoded?.user_id,
      },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }
    // Generate new access token and refresh token
    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
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
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};
