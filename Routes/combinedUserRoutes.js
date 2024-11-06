const Router = require("express");
const combinedUrserController = require("../Controller/combinedUserController");

const router = Router();

router.post("/", combinedUrserController.createCombinedUser);
router.get("/users", combinedUrserController.getUsers);
router.put("/user/:id", combinedUrserController.updateUser);
router.get("/:page/:limit", combinedUrserController.getCombinedUsers);

//Flask API Wrapper
router.get("/v2", combinedUrserController.getFlaskCombinedUser);
router.post("/v2", combinedUrserController.createFlaskCombinedUser);

module.exports = router;
