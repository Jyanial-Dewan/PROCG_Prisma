const Router = require('express');
const messageController = require('../Controller/messagesController')

const router = Router();

router.get('/', messageController.message);
router.get("/:id", messageController.getUniqueMessage);
router.get("/reply/:id", messageController.getReplyMessage);
router.post('/', messageController.createMessage);
router.put("/:id", messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;