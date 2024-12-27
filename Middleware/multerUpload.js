const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Ensure the base upload directory exists
const UPLOAD_FOLDER = "./uploads/profiles";
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

// Asynchronous function to delete existing images
const deleteExistingImages = async (folderPath) => {
  if (fs.existsSync(folderPath)) {
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.lstat(filePath);
      if (stat.isFile()) {
        await fs.promises.unlink(filePath);
      }
    }
  }
};

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const userFolder = path.join(
          UPLOAD_FOLDER,
          req.user.user_name.toLowerCase()
        );

        // Delete existing images in the user's folder
        await deleteExistingImages(userFolder);

        // Ensure the user's folder exists
        if (!fs.existsSync(userFolder)) {
          fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder); // Set the upload destination
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName = file.originalname.replace(fileExt, "").toLowerCase();
      cb(null, fileName + fileExt);
    },
  }),
  limits: {
    fileSize: 500000, // 500 KB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

module.exports = upload;
