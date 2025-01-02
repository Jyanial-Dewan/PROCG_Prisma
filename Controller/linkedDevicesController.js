const prisma = require("../DB/db.config");

exports.getDevices = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await prisma.linked_devices.findMany({
      where: {
        user_id: Number(user_id),
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// add device
exports.addDevice = async (req, res) => {
  const { user_id, deviceInfo } = req.body;
  // console.log(deviceInfo, "deviceInfo");
  try {
    const device = await prisma.linked_devices.findFirst({
      where: {
        user_id: Number(user_id),
        device_type: deviceInfo.device_type,
        browser_name: deviceInfo.browser_name,
        os: deviceInfo.os,
      },
    });
    // console.log(device, "device");
    if (!device) {
      const result = await prisma.linked_devices.create({
        data: {
          user_id: Number(user_id),
          device_type: deviceInfo.device_type,
          browser_name: deviceInfo.browser_name,
          browser_version: deviceInfo.browser_version,
          os: deviceInfo.os,
          user_agent: deviceInfo.user_agent,
          is_active: deviceInfo.is_active,
        },
      });
      return res.status(201).json(result);
    }

    const result = await prisma.linked_devices.update({
      where: {
        id: device.id,
        user_id: Number(user_id),
      },
      data: {
        user_id: Number(user_id),
        device_type: deviceInfo.device_type,
        browser_name: deviceInfo.browser_name,
        browser_version: deviceInfo.browser_version,
        os: deviceInfo.os,
        user_agent: deviceInfo.user_agent,
        is_active: deviceInfo.is_active,
      },
    });
    // console.log(result, "result");
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong adding device" });
  }
};

// inactivate device
exports.inactiveDevice = async (req, res) => {
  const { user_id, id } = req.params;
  const { is_active } = req.body;

  try {
    // first check if device exists
    const device = await prisma.linked_devices.findFirst({
      where: {
        id: Number(id),
        user_id: Number(user_id),
      },
    });
    if (device) {
      const result = await prisma.linked_devices.update({
        where: {
          id: Number(id),
          user_id: Number(user_id),
        },
        data: {
          is_active,
        },
      });
      return res.status(200).json(result);
    }
    return res.status(200).json({ message: "Device not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong deleting device" });
  }
};
