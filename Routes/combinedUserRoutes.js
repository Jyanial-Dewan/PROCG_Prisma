const Router = require("express");
const combinedUrserController = require("../Controller/combinedUserController");

const router = Router();

// combined users get with page and limit
router.get("/:page/:limit", combinedUrserController.getUsersWithPageAndLimit);
// combined users get without page and limit
router.get("/", combinedUrserController.getUsersView);
router.get("/:id", combinedUrserController.getUser);
router.post("/", combinedUrserController.createCombinedUser);

router.put("/:id", combinedUrserController.updateUser);

//Flask API Wrapper
router.get("/v2", combinedUrserController.getFlaskCombinedUser);
router.post("/v2", combinedUrserController.createFlaskCombinedUser);

module.exports = router;
