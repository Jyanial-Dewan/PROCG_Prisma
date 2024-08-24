const prisma = require("../DB/db.config");

exports.getDataSources = async (req, res) => {
  try {
    const result = await prisma.data_sources.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueDataSource = async (req, res) => {
  try {
    const data_source_id = req.params.id;
    const result = await prisma.data_sources.findUnique({
      where: {
        data_source_id: Number(data_source_id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Data Source not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createDataSource = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const data = req.body;
    const findDataSourceId = await prisma.data_sources.findUnique({
      where: {
        data_source_id: data.data_source_id,
      },
    });
    if (findDataSourceId)
      return res.status(408).json({ message: "Data Source Id already exist." });
    const findDataSourceName = await prisma.data_sources.findFirst({
      where: {
        datasource_name: data.datasource_name,
      },
    });
    if (findDataSourceName)
      return res
        .status(408)
        .json({ message: "Data Source Name already exist." });
    if (
      !data.datasource_name ||
      !data.description
      // !user_data.email_addresses.length ||
      // !user_data.tenant_id
    ) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.data_sources.create({
      data: {
        data_source_id: data.data_source_id,
        datasource_name: data.datasource_name,
        description: data.description,
        application_type: data.application_type,
        application_type_version: data.application_type_version,
        last_access_synchronization_date: data.last_access_synchronization_date,
        last_access_synchronization_status:
          data.last_access_synchronization_status,
        last_transaction_synchronization_date:
          data.last_transaction_synchronization_date,
        last_transaction_synchronization_status:
          data.last_transaction_synchronization_status,
        default_datasource: data.default_datasource,
      },
    });
    if (result) {
      return res.status(200).json({ result });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update User
exports.updateDataSource = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findDataSource = await prisma.data_sources.findUnique({
      where: {
        data_source_id: id,
      },
    });
    if (!findDataSource)
      return res.status(404).json({ message: "Data Source Id not found." });

    if (!data.datasource_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    }

    // Validation  End/---------------------------------/
    const result = await prisma.data_sources.update({
      where: {
        data_source_id: id,
      },
      data: {
        data_source_id: data.data_source_id,
        datasource_name: data.datasource_name,
        description: data.description,
        application_type: data.application_type,
        application_type_version: data.application_type_version,
        last_access_synchronization_date: data.last_access_synchronization_date,
        last_access_synchronization_status:
          data.last_access_synchronization_status,
        last_transaction_synchronization_date:
          data.last_transaction_synchronization_date,
        last_transaction_synchronization_status:
          data.last_transaction_synchronization_status,
        default_datasource: data.default_datasource,
      },
    });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDataSource = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findDataSourceId = await prisma.data_sources.findUnique({
      where: {
        data_source_id: id,
      },
    });
    if (!findDataSourceId)
      return res.status(404).json({ message: "Data Source not found." });

    // Validation  End/---------------------------------/
    const result = await prisma.data_sources.delete({
      where: {
        data_source_id: id,
      },
    });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
