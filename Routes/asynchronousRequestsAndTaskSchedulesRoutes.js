const Router = require("express");
const asynchronousRequestsAndTaskSchedulesController = require("../Controller/asynchronousRequestsAndTaskSchedulesController");

const router = Router();

router.get(
  "/",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedules
);
router.get(
  "/:page/:limit",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedulesLazyLoading
);
router.get(
  "/:task_name/:arm_param_id",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedule
);
router.get(
  "/view-requests",
  asynchronousRequestsAndTaskSchedulesController.getViewRequests
);
router.get(
  "/view-requests/:page/:limit",
  asynchronousRequestsAndTaskSchedulesController.getViewRequestsLazyLoading
);
router.post(
  "/create-task-schedule",
  asynchronousRequestsAndTaskSchedulesController.createTaskSchedule
);
router.put(
  "/update-task-schedule/:task_name/:redbeat_schedule_name",
  asynchronousRequestsAndTaskSchedulesController.updateTaskSchedule
);
router.put(
  "cancel-task-schedule/:task_name/:redbeat_schedule_name",
  asynchronousRequestsAndTaskSchedulesController.cancelTaskSchedule
);
module.exports = router;
