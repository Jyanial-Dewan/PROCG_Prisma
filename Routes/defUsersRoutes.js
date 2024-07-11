import { Router } from "express";
import { defUsersController } from "../Controller/defUsersController.js";

const router = Router();

router.get("/", defUsersController.getDefUsers);
router.get("/:user_id", defUsersController.getUniqueDefUser);
router.post("/", defUsersController.createDefUser);
router.put("/:user_id", defUsersController.updateDefUser);
router.delete("/:user_id", defUsersController.deleteDefUser);

export default router;
