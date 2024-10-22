const prisma = require("../DB/db.config");

exports.message = async (req, res) => {
  try {
    const message = await prisma.messages.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUniqueMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.messages.findUnique({
      where: {
        id: id,
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Message not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getReplyMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.messages.findMany({
      where: {
        parentid: id,
      },
      orderBy: {
        date: "desc",
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "MessageID not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const message_data = req.body;

    const result = await prisma.messages.create({
      data: {
        id: message_data.id,
        sender: message_data.sender,
        recivers: message_data.recivers,
        subject: message_data.subject,
        body: message_data.body,
        date: message_data.date,
        status: message_data.status,
        parentid: message_data.parentid,
        involvedusers: message_data.involvedusers,
        readers: message_data.readers,
      },
    });
    if (result) {
      return res.status(201).json({ result });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const message_data = req.body;
    const id = req.params.id;

    const result = await prisma.messages.update({
      where: {
        id: id,
      },

      data: {
        sender: message_data.sender,
        recivers: message_data.recivers,
        subject: message_data.subject,
        body: message_data.body,
        date: message_data.date,
        status: message_data.status,
        parentid: message_data.parentid,
        involvedusers: message_data.involvedusers,
        readers: message_data.readers,
      },
    });
    if (result) {
      return res.status(201).json({ result });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await prisma.messages.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getRecievedMessages = async (req, res) => {
  try {
    const user = req.params.user;
    const result = await prisma.messages.findMany({
      where: {
        recivers: {
          array_contains: user,
        },
      },
    });

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getNotificationMessages = async (req, res) => {
  try {
    const user = req.params.user;
    const result = await prisma.messages.findMany({
      where: {
        readers: {
          array_contains: user,
        },
      },
    });

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSentMessages = async (req, res) => {
  try {
    const user = req.params.user;
    const result = await prisma.messages.findMany({
      where: {
        sender: user,
      },
    });

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateReaders = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  try {
    const messagesToUpdate = await prisma.messages.findMany({
      where: {
        parentid: id,
      },
    });

    for (const message of messagesToUpdate) {
      const updatedReaders = message.readers.filter(
        (reader) => reader !== user
      );
      await prisma.messages.update({
        where: {
          id: message.id,
        },
        data: {
          readers: updatedReaders,
        },
      });
    }

    res.json({ message: "Readers field updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
