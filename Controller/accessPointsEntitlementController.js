const prisma = require("../DB/db.config");
exports.getAccessPointsEntitlement = async (req, res) => {
  try {
    const result = await prisma.access_points_elements.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueAccessPointsEntitlement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.access_points_elements.findUnique({
      where: {
        id: Number(id),
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
  const id = Math.max(...response.map((item) => item.id));
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
      return res
        .status(408)
        .json({ message: "Entitlement Name already exist." });
    if (!data.element_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.access_points_elements.create({
      data: {
        id: response.length > 0 ? id + 1 : 1,
        entitlement_id: data.entitlement_id,
        element_name: data.element_name,
        description: data.description,
        datasource: data.datasource,
        platform: data.platform,
        element_type: data.element_type,
        access_control: data.access_control,
        change_control: data.change_control,
        audit: data.audit,
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
        message: "data source name and description is Required",
      });
    } else if (findExistName) {
      return res
        .status(408)
        .json({ message: "Data Source name already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.access_points_elements.update({
      where: {
        id: id,
      },
      data: {
        id: id,
        entitlement_id: data.entitlement_id,
        element_name: data.element_name,
        description: data.description,
        datasource: data.datasource,
        platform: data.platform,
        element_type: data.element_type,
        access_control: data.access_control,
        change_control: data.change_control,
        audit: data.audit,
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
          id: id,
        },
      });
    if (!findAccessPointsEntitlementId)
      return res.status(404).json({ message: "Data Source not found." });

    // Validation  End/---------------------------------/
    const result = await prisma.access_points_elements.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
