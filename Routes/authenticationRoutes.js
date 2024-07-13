const Router = require("express");
const authentication = require("../Authentication/Authentication");

const router = Router();

router.post("/", authentication.login);

module.exports = router;
