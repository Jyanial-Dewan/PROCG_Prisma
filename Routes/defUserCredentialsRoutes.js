import { Router } from "express";
import { defUserCredentialsController } from "../Controller/defUserCrendentials.js";

const router = Router();

router.get("/", defUserCredentialsController.getDefUserCredentials);
router.get(
  "/:user_id",
  defUserCredentialsController.getUniqueDefUserCredentials
);
router.post("/create", defUserCredentialsController.createDefUserCredential);
router.put(
  "/:user_id/update",
  defUserCredentialsController.updateDefUserCredential
);
router.delete(
  "/:user_id/delete",
  defUserCredentialsController.deleteDefUserCredential
);

export default router;
