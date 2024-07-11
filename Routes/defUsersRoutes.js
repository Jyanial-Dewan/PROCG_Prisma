import { Router } from "express";
import { defUsersController } from "../Controller/defUsersController.js";

const router = Router();

router.get("/", defUsersController.getDefUsers);
router.get("/:user_id", defUsersController.getUniqueDefUser);
router.post("/create", defUsersController.createDefUser);
router.put("/:user_id/update", defUsersController.updateDefUser);
router.delete("/:user_id/delete", defUsersController.deleteDefUser);

export default router;
