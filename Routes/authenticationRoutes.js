const Router = require("express");
const authentication = require("../Authentication/Authentication");

const router = Router();

router.post("/", authentication.login);
router.get("/", authentication.logout);
router.get("/user", authentication.user);
router.get("/refresh-token", authentication.refreshToken);
router.get("/google", authentication.googleLogin);
router.get("/google/callback", authentication.googleCallback);
router.get("/github", authentication.githubLogin);
router.get("/github/callback", authentication.githubCallback);

module.exports = router;
