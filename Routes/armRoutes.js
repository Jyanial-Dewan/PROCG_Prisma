const Router = require("express");
const armControllers = require("../Controller/armController");

const router = Router();
// Register/Edit Asynchronous Tasks
router.get("/show-tasks", armControllers.getARMTasks);
router.get("/show-tasks/:page/:limit", armControllers.getARMTasksLazyLoading);
router.get("/show-task/:task_name", armControllers.getARMTask);
router.post("/register-task", armControllers.registerARMTask);
router.put("/edit-task/:task_name", armControllers.editARMTask);
router.put("/cancel-task/:task_name", armControllers.cancelARMTask);

// Task Params
router.get("/:task_name", armControllers.getTaskParams);
router.get("/:task_name/:page/:limit", armControllers.getTaskParamsLazyLoading);
router.post("/add-task-params/:task_name", armControllers.addTaskParams);
router.put(
  "/update-task-params/:task_name/:arm_param_id",
  armControllers.updateTaskParams
);
router.delete(
  "/delete-task-params/:task_name/:arm_param_id",
  armControllers.deleteTaskParams
);

module.exports = router;
