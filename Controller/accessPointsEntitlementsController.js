const prisma = require("../DB/db.config");
const currentDate = new Date();
exports.getAccessPointsEntitlement = async (req, res) => {
  try {
    const result = await prisma.access_points_elements.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique Data
exports.getUniqueAccessPointsEntitlement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.access_points_elements.findUnique({
      where: {
        access_point_id: Number(id),
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
exports.createAccessPointsEntitlement = async (req, res) => {
  const response = await prisma.access_points_elements.findMany();
  const id =
    response.length > 0
      ? Math.max(...response.map((item) => item.access_point_id)) + 1
      : 1;
  console.log(id);
  try {
    // Validation  START/---------------------------------/
    const data = req.body;

    const findAccessPointsElementName =
      await prisma.access_points_elements.findFirst({
        where: {
          element_name: data.element_name,
        },
      });
    if (findAccessPointsElementName)
      return res.status(408).json({ message: "Element Name already exist." });
    if (!data.element_name || !data.description) {
      return res.status(422).json({
        message: "Element name and description is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.access_points_elements.create({
      data: {
        access_point_id: id,
        element_name: data.element_name,
        description: data.description,
        platform: data.platform,
        element_type: data.element_type,
        access_control: data.access_control,
        change_control: data.change_control,
        audit: data.audit,
        created_by: data.created_by,
        created_on: currentDate,
        last_updated_by: data.last_updated_by,
        last_updated_on: currentDate,
        data_sources: {
          connect: { data_source_id: data.data_source_id },
        },
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
exports.updateAccessPointsEntitlement = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findExistName = await prisma.access_points_elements.findFirst({
      where: {
        element_name: data.element_name,
      },
    });
    if (!data.element_name || !data.description) {
      return res.status(422).json({
        message: "Element name and description is Required",
      });
    } else if (findExistName) {
      return res.status(408).json({ message: "Element name already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.access_points_elements.update({
      where: {
        access_point_id: id,
      },
      data: {
        element_name: data.element_name,
        description: data.description,
        platform: data.platform,
        element_type: data.element_type,
        access_control: data.access_control,
        change_control: data.change_control,
        audit: data.audit,
        created_by: data.created_by,
        created_on: currentDate,
        last_updated_by: data.last_updated_by,
        last_updated_on: currentDate,
        data_sources: {
          connect: { data_source_id: data.data_source_id },
        },
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteAccessPointsEntitlement = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findAccessPointsEntitlementId =
      await prisma.access_points_elements.findUnique({
        where: {
          access_point_id: id,
        },
      });
    if (!findAccessPointsEntitlementId)
      return res.status(404).json({ message: "Access Point not found." });

    // Validation  End/---------------------------------/
    const result = await prisma.access_points_elements.delete({
      where: {
        access_point_id: id,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertAccessPointsEntitlement = async (req, res) => {
  const data = req.body.upsertAttributes || req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }

  const upsertResults = [];
  const currentDate = new Date(); // Ensure currentDate is defined

  try {
    for (const item of data) {
      const dataSourceId = item.data_source_id;
      const response = await prisma.access_points_elements.findMany();
      const id =
        response.length > 0
          ? Math.max(...response.map((elem) => elem.access_point_id)) + 1
          : 1;

      const result = await prisma.access_points_elements.upsert({
        where: { access_point_id: item.access_point_id },
        update: {
          element_name: item.element_name,
          description: item.description,
          platform: item.platform,
          element_type: item.element_type,
          access_control: item.access_control,
          change_control: item.change_control,
          audit: item.audit,
          created_by: item.created_by,
          created_on: currentDate,
          last_updated_by: item.last_updated_by,
          last_updated_on: currentDate,
          data_sources: {
            connect: dataSourceId
              ? { data_source_id: dataSourceId }
              : undefined,
          },
        },
        create: {
          access_point_id: id,
          element_name: item.element_name,
          description: item.description,
          platform: item.platform,
          element_type: item.element_type,
          access_control: item.access_control,
          change_control: item.change_control,
          audit: item.audit,
          created_by: item.created_by,
          created_on: currentDate,
          last_updated_by: item.last_updated_by,
          last_updated_on: currentDate,
          data_sources: {
            connect: dataSourceId
              ? { data_source_id: dataSourceId }
              : undefined,
          },
        },
      });
      upsertResults.push(result);
    }

    return res.status(200).json(upsertResults);
  } catch (error) {
    console.error("Error in upsert operation:", error);
    return res.status(500).json({ error: error.message });
  }
};
