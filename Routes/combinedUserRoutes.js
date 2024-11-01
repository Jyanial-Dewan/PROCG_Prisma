const Router = require("express");
const combinedUrserController = require("../Controller/combinedUserController");

const router = Router();

router.post("/", combinedUrserController.createCombinedUser);
router.get("/:page/:limit", combinedUrserController.getCombinedUsers);
router.get("/v2", combinedUrserController.getFlaskCombinedUser);
router.post("/v2", combinedUrserController.createFlaskCombinedUser);

module.exports = router;
