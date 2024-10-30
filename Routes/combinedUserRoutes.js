const Router = require("express");
const combinedUrserController = require("../Controller/combinedUserController");

const router = Router();

router.post("/", combinedUrserController.createCombinedUser);
router.get("/:page/:limit", combinedUrserController.getCombinedUsers);

module.exports = router;
