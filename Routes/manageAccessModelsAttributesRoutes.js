const Router = require("express");
const manageAccessModelsAttributesControllers = require("../Controller/manageAccessModelsAttributesControllers");

const router = Router();

router.get(
  "/",
  manageAccessModelsAttributesControllers.getManageAccessModelAttributes
);
router.get(
  "/:id",
  manageAccessModelsAttributesControllers.getUniqueManageAccessModelAttribute
);
router.post(
  "/",
  manageAccessModelsAttributesControllers.createManageAccessModelAttribute
);
router.delete(
  "/:id",
  manageAccessModelsAttributesControllers.deleteManageAccessModelAttribute
);
router.put(
  "/:id",
  manageAccessModelsAttributesControllers.updateManageAccessModelAttribute
);
router.post(
  "/upsert",
  manageAccessModelsAttributesControllers.upsertManageAccessModelAttribute
);

module.exports = router;
