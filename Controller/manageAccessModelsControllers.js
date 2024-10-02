const prisma = require("../DB/db.config");
const currentDate = new Date().toLocaleDateString();
exports.getManageAccessModels = async (req, res) => {
  try {
    const result = await prisma.manage_access_models.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueManageAccessModel = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_access_models.findUnique({
      where: {
        manage_access_model_id: Number(id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Data not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createManageAccessModel = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const data = req.body;

    const findManageAccessModelName =
      await prisma.manage_access_models.findFirst({
        where: {
          model_name: data.model_name,
        },
      });
    if (findManageAccessModelName)
      return res
        .status(408)
        .json({ message: "Manage Access Model Name already exist." });
    if (!data.model_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    }
    const resultAll = await prisma.manage_access_models.findMany();
    const id = Math.max(
      ...resultAll.map((item) => item.manage_access_model_id)
    );
    const dateToday = new Date().toLocaleDateString("en-CA");
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_models.create({
      data: {
        manage_access_model_id: resultAll.length > 0 ? id + 1 : 1,
        model_name: data.model_name,
        description: data.description,
        type: data.type,
        run_status: data.run_status,
        state: data.state,
        last_run_date: dateToday,
        created_by: data.created_by,
        last_updated_by: data.last_updated_by,
        last_updated_date: dateToday,
        revision: 0,
        revision_date: dateToday,
      },
    });
    if (result) {
      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update User
exports.updateManageAccessModel = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessModel = await prisma.manage_access_models.findUnique({
      where: {
        manage_access_model_id: id,
      },
    });

    if (!findManageAccessModel) {
      return res.status(404).json({ message: "Data Source Id not found." });
    } else if (!data.model_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    }
    const dateToday = new Date().toLocaleDateString("en-CA");
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_models.update({
      where: {
        manage_access_model_id: id,
      },
      data: {
        manage_access_model_id: id,
        model_name: data.model_name,
        description: data.description,
        type: data.type,
        run_status: data.run_status,
        state: data.state,
        last_run_date: dateToday,
        created_by: data.created_by,
        last_updated_by: data.last_updated_by,
        last_updated_date: dateToday,
        revision: data.revison + 1,
        revision_date: dateToday,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertManageAccessModel = async (req, res) => {
  const data = req.body.upsertLogics || req.body;
  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }
  const resultAll = await prisma.manage_access_models.findMany();
  const id = Math.max(...resultAll.map((item) => item.manage_access_model_id));
  const upsertResults = [];
  const dateToday = new Date().toLocaleDateString("en-CA");
  try {
    for (const item of data) {
      const result = await prisma.manage_access_models.upsert({
        where: {
          manage_access_model_id: item?.manage_access_model_id ?? 0,
        },
        update: {
          manage_access_model_id: item.manage_access_model_id,
          model_name: item.model_name,
          description: item.description,
          type: item.type,
          run_status: item.run_status,
          state: item.state,
          last_run_date: dateToday,
          created_by: item.created_by,
          last_updated_by: item.last_updated_by,
          last_updated_date: dateToday,
          revision: item.revision + 1,
          revision_date: dateToday,
        },
        create: {
          manage_access_model_id: item.manage_access_model_id,
          model_name: item.model_name,
          description: item.description,
          type: item.type,
          run_status: item.run_status,
          state: item.state,
          last_run_date: dateToday,
          created_by: item.created_by,
          last_updated_by: item.last_updated_by,
          last_updated_date: dateToday,
          revision: 0,
          revision_date: dateToday,
        },
      });
      upsertResults.push(result);
      // console.log(result);
    }
    return res.status(200).json(upsertResults);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteManageAccessModel = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessModelId =
      await prisma.manage_access_models.findUnique({
        where: {
          manage_access_model_id: id,
        },
      });
    if (!findManageAccessModelId)
      return res.status(404).json({ message: "Data Source not found." });

    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_models.delete({
      where: {
        manage_access_model_id: id,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
