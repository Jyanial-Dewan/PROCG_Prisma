const prisma = require("../DB/db.config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  //-----------------
  const saltLength = "16";
  const iterations = 1000;
  const keyLength = 64;
  const digest = "sha256";

  // Hash password
  function hashPassword(password) {
    // const salt = crypto.randomBytes(saltLength).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, saltLength, iterations, keyLength, digest)
      .toString("hex");
    return `${hash}`;
  }
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
      const encryptedPassword = hashPassword(password);
      if (userCredential && userCredential.password === encryptedPassword) {
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
  } catch (error) {}
};
