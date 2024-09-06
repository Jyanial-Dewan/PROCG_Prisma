const prisma = require("../DB/db.config");
exports.getAccessPointsEntitlement = async (req, res) => {
  try {
    const result = await prisma.access_points_entitlement.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueAccessPointsEntitlement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.access_points_entitlement.findUnique({
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
  const response = await prisma.access_points_entitlement.findMany();
  const id = Math.max(response.map((item) => item.id));
  try {
    // Validation  START/---------------------------------/
    const data = req.body;

    const findAccessPointsEntitlementName =
      await prisma.access_points_entitlement.findFirst({
        where: {
          entitlement_name: data.entitlement_name,
        },
      });
    if (findAccessPointsEntitlementName)
      return res
        .status(408)
        .json({ message: "Entitlement Name already exist." });
    if (
      !data.entitlement_name ||
      !data.description
      // !user_data.email_addresses.length ||
      // !user_data.tenant_id
    ) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.access_points_entitlement.create({
      data: {
        id: (id ? id : 0) + 1,
        entitlement_id: data.entitlement_id,
        entitlement_name: data.entitlement_name,
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
    const findExistName = await prisma.access_points_entitlement.findFirst({
      where: {
        entitlement_name: data.entitlement_name,
      },
    });
    if (!data.entitlement_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    } else if (findExistName) {
      return res
        .status(408)
        .json({ message: "Data Source name already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.access_points_entitlement.update({
      where: {
        id: id,
      },
      data: {
        id: id,
        entitlement_id: data.entitlement_id,
        entitlement_name: data.entitlement_name,
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
      await prisma.access_points_entitlement.findUnique({
        where: {
          id: id,
        },
      });
    if (!findAccessPointsEntitlementId)
      return res.status(404).json({ message: "Data Source not found." });

    // Validation  End/---------------------------------/
    const result = await prisma.access_points_entitlement.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
