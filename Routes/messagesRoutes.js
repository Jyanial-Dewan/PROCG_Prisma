const Router = require("express");
const messageController = require("../Controller/messagesController");

const router = Router();

router.get("/", messageController.message);
router.get("/:id", messageController.getUniqueMessage);
router.get("/reply/:id", messageController.getReplyMessage);
router.post("/", messageController.createMessage);
router.put("/:id", messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);
router.get("/received/:user", messageController.getRecievedMessages);
router.get("/notification/:user", messageController.getRecievedMessages);
router.get("/sent/:user", messageController.getSentMessages);
router.put("/update-readers/:id", messageController.updateReaders);

module.exports = router;
