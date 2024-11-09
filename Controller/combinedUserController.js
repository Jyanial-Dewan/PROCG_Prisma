const prisma = require("../DB/db.config");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { default: axios } = require("axios");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const flash_api_url = process.env.FLASK_API_URL;

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

exports.getUsersView = async (req, res) => {
  try {
    const users = await prisma.def_users_v.findMany({
      orderBy: {
        user_id: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await prisma.def_users_v.findUnique({
      where: {
        user_id: Number(id),
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
// combined users get with page and limit
exports.getUsersWithPageAndLimit = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const users = await prisma.def_users_v.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        user_id: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);
    // Validation  START/---------------------------------/
    const findDefUserId = await prisma.def_users.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!findDefUserId)
      return res.status(404).json({ message: "User Id not found." });

    // Validation  End/---------------------------------/
    await prisma.def_users.update({
      where: {
        user_id: id,
      },
      data: {
        user_name: data.user_name,
        email_addresses: data.email_addresses,
      },
    });
    await prisma.def_persons.update({
      where: {
        user_id: id,
      },
      data: {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        job_title: data.job_title,
      },
    });
    if (data.password) {
      const res = await prisma.def_user_credentials.update({
        where: {
          user_id: id,
        },
        data: {
          password: await hashPassword(data.password),
        },
      });
    }
    return res.status(200).json({ result: "Updated successfully ." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Flask API Wrapper

exports.getFlaskCombinedUser = async (req, res) => {
  const response = await axios.get(`${flash_api_url}/users`);
  return res.status(200).json(response.data);
};

exports.createFlaskCombinedUser = async (req, res) => {
  const data = req.body;

  try {
    await axios.post(`${flash_api_url}/users`, data);
    return res.status(201).json({ message: "Record inserted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
