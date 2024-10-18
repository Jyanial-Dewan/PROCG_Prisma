const Router = require("express");
const accessPointsEntitlementController = require("../Controller/accessPointsEntitlementsController");

const router = Router();

router.get("/", accessPointsEntitlementController.getAccessPointsEntitlement);
router.get(
  "/:id",
  accessPointsEntitlementController.getUniqueAccessPointsEntitlement
);
router.post(
  "/",
  accessPointsEntitlementController.createAccessPointsEntitlement
);
router.delete(
  "/:id",
  accessPointsEntitlementController.deleteAccessPointsEntitlement
);
router.put(
  "/:id",
  accessPointsEntitlementController.updateAccessPointsEntitlement
);

module.exports = router;
