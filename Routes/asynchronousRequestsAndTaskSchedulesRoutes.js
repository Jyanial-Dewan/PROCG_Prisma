const Router = require("express");
const asynchronousRequestsAndTaskSchedulesController = require("../Controller/asynchronousRequestsAndTaskSchedulesController");

const router = Router();

router.get(
  "/",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedules
);
router.get(
  "/:task_name/:arm_param_id",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedule
);
router.post(
  "/create-ad-hoc-task-schedule",
  asynchronousRequestsAndTaskSchedulesController.createAdHocTaskSchedule
);
router.post(
  "/create-run-script-task-schedule",
  asynchronousRequestsAndTaskSchedulesController.createRunScriptTaskSchedule
);
router.put(
  "/update-task-schedule/:task_name/:schedule_name",
  asynchronousRequestsAndTaskSchedulesController.updateTaskSchedule
);
router.put(
  "cancel-task-schedule/:task_name/:redbeat_schedule_name",
  asynchronousRequestsAndTaskSchedulesController.cancelTaskSchedule
);
module.exports = router;
