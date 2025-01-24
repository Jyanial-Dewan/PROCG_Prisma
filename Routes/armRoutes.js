const Router = require("express");
const armControllers = require("../Controller/armController");

const router = Router();

router.get("/show-tasks", armControllers.getARMTasks);
router.get("/show-task/:task_name", armControllers.getARMTask);
router.post("/register-task", armControllers.registerARMTask);
router.put("/edit-task/:task_name", armControllers.editARMTask);
router.put("/cancel-task/:task_name", armControllers.cancelARMTask);

module.exports = router;
