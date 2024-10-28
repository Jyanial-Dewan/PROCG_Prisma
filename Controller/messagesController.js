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
    const id = req.params.parentid;
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
    const { user, page } = req.params;
    const pageNumber = parseInt(page);
    const limit = 5;
    let startNumber = 0;
    const endNumber = pageNumber * limit;
    if (pageNumber > 1) {
      const pageInto = pageNumber - 1;
      startNumber = pageInto * limit;
    }
    const result = await prisma.messages.findMany({
      where: {
        recivers: {
          array_contains: user,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    if (result) {
      const receivedMessages = result.filter((msg) => msg.status === "Sent");
      const limitedMessages = receivedMessages.slice(startNumber, endNumber);
      return res.status(200).json(limitedMessages);
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
      orderBy: {
        date: "desc",
      },
    });

    if (result) {
      const notificationMessages = result.filter(
        (msg) => msg.status === "Sent"
      );
      return res.status(200).json(notificationMessages);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSentMessages = async (req, res) => {
  try {
    const { user, page } = req.params;
    const pageNumber = parseInt(page);
    const limit = 5;
    let startNumber = 0;
    const endNumber = pageNumber * limit;
    if (pageNumber > 1) {
      const pageInto = pageNumber - 1;
      startNumber = pageInto * limit;
    }
    const result = await prisma.messages.findMany({
      where: {
        sender: user,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (result) {
      const sentMessages = result.filter((msg) => msg.status === "Sent");
      const limitedMessages = sentMessages.slice(startNumber, endNumber);
      return res.status(200).json(limitedMessages);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDraftMessages = async (req, res) => {
  try {
    const { user, page } = req.params;
    const pageNumber = parseInt(page);
    const limit = 5;
    let startNumber = 0;
    const endNumber = pageNumber * limit;
    if (pageNumber > 1) {
      const pageInto = pageNumber - 1;
      startNumber = pageInto * limit;
    }
    const result = await prisma.messages.findMany({
      where: {
        sender: user,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (result) {
      const draftMessages = result.filter((msg) => msg.status === "Draft");
      const limitedMessages = draftMessages.slice(startNumber, endNumber);
      return res.status(200).json(limitedMessages);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateReaders = async (req, res) => {
  const { parentid, user } = req.params;

  try {
    const messagesToUpdate = await prisma.messages.findMany({
      where: {
        parentid: parentid,
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

exports.getTotalRecievedMessages = async (req, res) => {
  try {
    const user = req.params.user;
    const result = await prisma.messages.findMany({
      where: {
        recivers: {
          array_contains: user,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    if (result) {
      const receivedMessages = result.filter((msg) => msg.status === "Sent");

      return res.status(200).json({ total: receivedMessages.length });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTotalSentMessages = async (req, res) => {
  try {
    const user = req.params.user;
    const result = await prisma.messages.findMany({
      where: {
        sender: user,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (result) {
      const sentMessages = result.filter((msg) => msg.status === "Sent");
      return res.status(200).json({ total: sentMessages.length });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTotalDraftMessages = async (req, res) => {
  try {
    const user = req.params.user;
    const result = await prisma.messages.findMany({
      where: {
        sender: user,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (result) {
      const draftMessages = result.filter((msg) => msg.status === "Draft");
      return res.status(200).json({ total: draftMessages.length });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
