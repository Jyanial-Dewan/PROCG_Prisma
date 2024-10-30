const prisma = require("../DB/db.config");
const crypto = require("crypto");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex");
    const iterations = 600000;
    const keyLength = 32;
    const digest = "sha256";

    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      (err, derivedKey) => {
        if (err) return reject(err);

        const formattedHash = `pbkdf2:${digest}:${iterations}$${salt}$${derivedKey.toString(
          "hex"
        )}`;
        resolve(formattedHash);
      }
    );
  });
};

exports.createCombinedUser = async (req, res) => {
  try {
    const combinedUserData = req.body;
    const currentTime = new Date();
    const maxUserIDResult = await prisma.def_users.aggregate({
      _max: {
        user_id: true,
      },
    });

    const maxID = maxUserIDResult._max.user_id + 1;

    if (combinedUserData.user_type === "person") {
      await prisma.def_users.create({
        data: {
          user_id: maxID,
          user_name: combinedUserData.user_name,
          user_type: combinedUserData.user_type,
          email_addresses: combinedUserData.email_addresses,
          created_by: combinedUserData.created_by,
          created_on: currentTime.toLocaleString(),
          last_updated_by: combinedUserData.last_updated_by,
          last_updated_on: currentTime.toLocaleString(),
          tenant_id: combinedUserData.tenant_id,
        },
      });

      await prisma.def_persons.create({
        data: {
          user_id: maxID,
          first_name: combinedUserData.first_name,
          middle_name: combinedUserData.middle_name,
          last_name: combinedUserData.last_name,
          job_title: combinedUserData.job_title,
        },
      });

      await prisma.def_user_credentials.create({
        data: {
          user_id: maxID,
          password: await hashPassword(combinedUserData.password),
        },
      });
    }

    if (combinedUserData.user_type !== "person") {
      await prisma.def_users.create({
        data: {
          user_id: maxID,
          user_name: combinedUserData.user_name,
          user_type: combinedUserData.user_type,
          email_addresses: combinedUserData.email_addresses,
          created_by: combinedUserData.created_by,
          created_on: currentTime.toLocaleString(),
          last_updated_by: combinedUserData.last_updated_by,
          last_updated_on: currentTime.toLocaleString(),
          tenant_id: combinedUserData.tenant_id,
        },
      });

      await prisma.def_user_credentials.create({
        data: {
          user_id: maxID,
          password: await hashPassword(combinedUserData.password),
        },
      });
    }

    if (!combinedUserData.user_name || !combinedUserData.user_type) {
      return res.status(422).json({
        message: "user_name, user_type is Required",
      });
    } else {
      return res.status(201).json({
        message: "User Recod Created",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCombinedUsers = async (req, res) => {
  const { page, limit } = req.params;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  let startNumber = 0;
  const endNumber = pageNumber * limitNumber;
  if (pageNumber > 1) {
    const pageInto = pageNumber - 1;
    startNumber = pageInto * limitNumber;
  }
  try {
    const users = await prisma.def_users.findMany({
      orderBy: {
        user_id: "desc",
      },
    });

    const persons = await prisma.def_persons.findMany();

    const combinedUsers = users.map((user) => {
      const person = persons.find((p) => p.user_id === user.user_id);

      return {
        ...user,
        ...person,
      };
    });

    const response = combinedUsers.slice(startNumber, endNumber);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
