const Router = require('express');
const combinedUrserController = require('../Controller/combinedUserController');

const router = Router();

router.post("/", combinedUrserController.createCombinedUser);

module.exports = router;