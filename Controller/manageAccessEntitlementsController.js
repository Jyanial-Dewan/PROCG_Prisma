const prisma = require("../DB/db.config");
const currentDate = new Date().toLocaleDateString();
exports.getManageAccessEntitlements = async (req, res) => {
  try {
    const result = await prisma.manage_access_entitlements.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueManageAccessEntitlement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_access_entitlements.findUnique({
      where: {
        entitlement_id: Number(id),
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
exports.createManageAccessEntitlement = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const data = req.body;
    const findManageAccessEntitlementId =
      await prisma.manage_access_entitlements.findUnique({
        where: {
          entitlement_id: data.entitlement_id,
        },
      });
    if (findManageAccessEntitlementId)
      return res.status(408).json({ message: "Data Source Id already exist." });
    const findManageAccessEntitlementName =
      await prisma.manage_access_entitlements.findFirst({
        where: {
          entitlement_name: data.entitlement_name,
        },
      });
    if (findManageAccessEntitlementName)
      return res
        .status(408)
        .json({ message: "Data Source Name already exist." });
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
    const result = await prisma.manage_access_entitlements.create({
      data: {
        entitlement_id: data.entitlement_id,
        entitlement_name: data.entitlement_name,
        description: data.description,
        comments: data.comments,
        status: data.status,
        effective_date: currentDate,
        revison: 1,
        revision_date: currentDate,
        created_on: currentDate,
        last_updated_on: currentDate,
        last_updated_by: data.last_updated_by,
        created_by: data.created_by,
      },
    });
    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update User
exports.updateManageAccessEntitlement = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessEntitlement =
      await prisma.manage_access_entitlements.findUnique({
        where: {
          entitlement_id: id,
        },
      });
    const findExistName = await prisma.manage_access_entitlements.findFirst({
      where: {
        entitlement_name: data.entitlement_name,
      },
    });
    if (!findManageAccessEntitlement) {
      return res.status(404).json({ message: "Data Source Id not found." });
    } else if (!data.entitlement_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    } else if (findExistName) {
      return res
        .status(408)
        .json({ message: "Data Source name already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_entitlements.update({
      where: {
        entitlement_id: id,
      },
      data: {
        entitlement_id: data.entitlement_id,
        entitlement_name: data.entitlement_name,
        description: data.description,
        comments: data.comments,
        status: data.status,
        effective_date: data.effective_date,
        revison: findManageAccessEntitlement.revison + 1,
        revision_date: currentDate,
        created_on: data.created_on,
        last_updated_on: currentDate,
        last_updated_by: data.last_updated_by,
        created_by: data.created_by,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteManageAccessEntitlement = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessEntitlementId =
      await prisma.manage_access_entitlements.findUnique({
        where: {
          entitlement_id: id,
        },
      });
    if (!findManageAccessEntitlementId)
      return res.status(404).json({ message: "Data Source not found." });

    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_entitlements.delete({
      where: {
        entitlement_id: id,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
