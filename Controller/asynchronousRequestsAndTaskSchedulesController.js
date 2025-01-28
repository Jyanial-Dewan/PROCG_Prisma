// asynchronousRequestsAndTaskSchedulesController.js;
const axios = require("axios");
const arm_api_url = process.env.ARM_API_URL;
exports.getTaskSchedule = async (req, res) => {
  const { task_name, arm_param_id } = req.params;
  try {
    const response = await axios.get(
      `${arm_api_url}/Show_TaskSchedule/${task_name}/${arm_param_id}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskSchedules = async (req, res) => {
  try {
    const response = await axios.get(`${arm_api_url}/Show_TaskSchedules`);
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAdHocTaskSchedule = async (req, res) => {
  const data = req.body;
  console.log(data, "data");
  try {
    const response = await axios.post(
      `${arm_api_url}/Create_TaskSchedule`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.createRunScriptTaskSchedule = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(
      `${arm_api_url}/Create_TaskSchedule`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskSchedule = async (req, res) => {
  const { task_name, schedule_name } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${arm_api_url}/Update_TaskSchedule/${task_name}/${schedule_name}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.cancelTaskSchedule = async (req, res) => {
  const { task_name, redbeat_schedule_name } = req.params;
  try {
    const response = await axios.put(
      `${arm_api_url}/Update_TaskSchedule/${task_name}/${redbeat_schedule_name}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
