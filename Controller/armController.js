const { default: axios } = require("axios");
const arm_api_url = process.env.ARM_API_URL;

exports.getARMTasks = async (req, res) => {
  const response = await axios.get(`${arm_api_url}/Show_Tasks`);

  return res.status(200).json(response.data);
};
exports.getARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  const response = await axios.get(`${arm_api_url}/Show_Task/${task_name}`);
  return res.status(200).json(response.data);
};
exports.registerARMTask = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(`${arm_api_url}/Create_Task`, data);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.editARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  const data = req.body;
  try {
    const response = await axios.put(
      `${arm_api_url}/Update_Task/${task_name}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.cancelARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  try {
    const response = await axios.put(`${arm_api_url}/Cancel_Task/${task_name}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
