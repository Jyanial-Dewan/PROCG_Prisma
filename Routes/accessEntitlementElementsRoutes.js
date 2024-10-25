const Router = require("express");
const accessEntitlementElementsController = require("../Controller/accessEntitlementElementsController");

const router = Router();

router.get(
  "/",
  accessEntitlementElementsController.getAccessEntitlementElement
);
router.get(
  "/p",
  accessEntitlementElementsController.perPageAccessEntitlementElement
);
router.get(
  "/:id",
  accessEntitlementElementsController.getUniqueAccessEntitlementElement
);
router.post(
  "/",
  accessEntitlementElementsController.createAccessEntitlementElement
);
router.delete(
  "/",
  accessEntitlementElementsController.deleteAccessEntitlementElement
);

module.exports = router;
