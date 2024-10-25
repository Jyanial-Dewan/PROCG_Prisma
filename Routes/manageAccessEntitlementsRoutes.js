const Router = require("express");
const manageAccessEntitlementsController = require("../Controller/manageAccessEntitlementsController");

const router = Router();

router.get("/", manageAccessEntitlementsController.getManageAccessEntitlements);
router.get(
  "/p",
  manageAccessEntitlementsController.perPageManageAccessEntitlement
);
router.get(
  "/:id",
  manageAccessEntitlementsController.getUniqueManageAccessEntitlement
);
router.post(
  "/",
  manageAccessEntitlementsController.createManageAccessEntitlement
);
router.delete(
  "/:id",
  manageAccessEntitlementsController.deleteManageAccessEntitlement
);
router.put(
  "/:id",
  manageAccessEntitlementsController.updateManageAccessEntitlement
);

module.exports = router;
