const prisma = require('../DB/db.config')

exports.getDefUserCredentials = async (req, res) => {
  try {
    const result = await prisma.def_user_credentials.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique defUserCredentials
exports.getUniqueDefUserCredentials = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: Number(user_id),
      },
    });
    if (result) {
      return res.status(200).json({ result });
    } else {
      return res.status(404).json({ message: "User Credentials not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createDefUserCredential = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const user_data = req.body;
    const findDefUserId = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: user_data.user_id,
      },
    });
    if (findDefUserId) {
      return res
        .status(408)
        .json({ message: "User Credential Id already exist." });
    } else {
      const result = await prisma.def_user_credentials.create({
        data: {
          user_id: user_data.user_id,
          password: user_data.password,
        },
      });
      return res.status(200).json({ result });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update User
exports.updateDefUserCredential = async (req, res) => {
  try {
    const user_data = req.body;
    const user_id = Number(req.params.user_id);

    const findDefUserId = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: user_id,
      },
    });

    if (findDefUserId) {
      const result = await prisma.def_user_credentials.update({
        where: {
          user_id: user_id,
        },
        data: {
          password: user_data.password,
        },
      });
      return res.status(200).json({ result });
    } else {
      return res
        .status(404)
        .json({ message: "User Credential Id not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDefUserCredential = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const findDefUserId = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (findDefUserId) {
      const result = await prisma.def_user_credentials.delete({
        where: {
          user_id: user_id,
        },
      });
      return res.status(200).json({ result });
    } else {
      return res
        .status(404)
        .json({ message: "Def User Credential not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
