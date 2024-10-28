const Router = require("express");
const messageController = require("../Controller/messagesController");

const router = Router();

router.get("/", messageController.message);
router.get("/:id", messageController.getUniqueMessage);
router.get("/reply/:parentid", messageController.getReplyMessage);
router.post("/", messageController.createMessage);
router.put("/:id", messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);
router.get("/received/:user/:page", messageController.getRecievedMessages);
router.get("/notification/:user", messageController.getNotificationMessages);
router.get("/sent/:user/:page", messageController.getSentMessages);
router.get("/draft/:user/:page", messageController.getDraftMessages);
router.put("/update-readers/:parentid/:user", messageController.updateReaders);
router.get("/total-received/:user", messageController.getTotalRecievedMessages);
router.get("/total-sent/:user", messageController.getTotalSentMessages);
router.get("/total-draft/:user", messageController.getTotalDraftMessages);

module.exports = router;
