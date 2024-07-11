import { Router } from "express";
import { defUserCredentialsController } from "../Controller/defUserCrendentials.js";

const router = Router();

router.get("/", defUserCredentialsController.getDefUserCredentials);
router.get(
  "/:user_id",
  defUserCredentialsController.getUniqueDefUserCredentials
);
router.post("/", defUserCredentialsController.createDefUserCredential);
router.put(
  "/:user_id",
  defUserCredentialsController.updateDefUserCredential
);
router.delete(
  "/:user_id",
  defUserCredentialsController.deleteDefUserCredential
);

export default router;
