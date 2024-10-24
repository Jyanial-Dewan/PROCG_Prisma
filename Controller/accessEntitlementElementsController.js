const prisma = require("../DB/db.config");
//get Data
exports.getAccessEntitlementElement = async (req, res) => {
  try {
    const result = await prisma.access_entitlement_elements.findMany();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.createAccessEntitlementElement = async (req, res) => {
  try {
    const result = await prisma.access_entitlement_elements.create({
      data: req.body,
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//get unique Data
exports.getUniqueAccessEntitlementElement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.access_entitlement_elements.findMany({
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
//Delete Data
exports.deleteAccessEntitlementElement = async (req, res) => {
  const { entitlementId, accessPointId } = req.body;

  try {
    const deletedRecord = await prisma.access_entitlement_elements.deleteMany({
      where: {
        entitlement_id: entitlementId,
        access_point_id: accessPointId,
      },
    });

    if (deletedRecord.count > 0) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting record" });
  } finally {
  }
};
