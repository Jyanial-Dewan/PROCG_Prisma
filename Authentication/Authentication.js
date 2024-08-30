const prisma = require("../DB/db.config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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
        const token = jwt.sign(
          {
            user_id: user.user_id,
            user_name: user.user_name,
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res.status(200).json({
          user_id: user.user_id,
          user_name: user.user_name,
          tenant_id: user.tenant_id,
          access_token: token,
        });
      } else {
        return res.status(408).json({ error: "Invalid credential" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
