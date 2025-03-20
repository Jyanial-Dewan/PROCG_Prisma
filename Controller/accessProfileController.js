const axios = require("axios");

exports.getAccessProfiles = async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await axios.get(
      `https://procg.viscorp.app/api/v2/access_profiles/${user_id}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createProfile = async (req, res) => {
  const data = req.body;
  const { user_id } = req.params;
  try {
    const response = await axios.post(
      `http://procg.viscorp.app/api/v2/access_profiles/${user_id}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { user_id, serial_number } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `http://procg.viscorp.app/api/v2/access_profiles/${user_id}/${serial_number}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  const { user_id, serial_number } = req.params;
  try {
    const response = await axios.delete(
      `http://procg.viscorp.app/api/v2/access_profiles/${user_id}/${serial_number}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
