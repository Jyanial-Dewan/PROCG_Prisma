const prisma = require("../DB/db.config");
const { message } = require("./messagesController");

exports.getDefProcesses = async (req, res) => {
  try {
    const response = await prisma.def_processes.findMany({
      orderBy: {
        process_id: "desc",
      },
    });
    // console.log(response, "response");
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getDefProcess = async (req, res) => {
  const { process_name } = req.params;
  try {
    const response = await prisma.def_processes.findFirst({
      where: {
        process_name,
      },
    });
    // console.log(response, "response");
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createDefProcess = async (req, res) => {
  try {
    const { process_id, process_name, process_structure } = req.body;
    await prisma.def_processes.create({
      data: { process_id, process_name, process_structure },
    });
    return res.status(201).json({ message: "Process created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateDefProcess = async (req, res) => {
  try {
    console.log("first");
    const { process_id } = req.params;
    const { process_structure } = req.body;
    // console.log(process_id, process_structure, "process_id,process_structure");
    const response = await prisma.def_processes.update({
      where: { process_id: Number(process_id) },
      data: { process_structure },
    });
    return res.status(200).json({ message: "Process updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
