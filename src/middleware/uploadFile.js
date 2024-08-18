import multer from "multer";
import { promises as fsPromises } from "fs";

const dirPath = "./public/temp";

// Ensure the directory exists
async function ensureDirectoryExists(dirPath) {
  try {
    await fsPromises.access(dirPath);
  } catch (error) {
    // Directory does not exist, create it
    await fsPromises.mkdir(dirPath, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await ensureDirectoryExists(dirPath);
    cb(null, dirPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: process.env.FILE_SIZE }, // Limit file size to 256MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|avi/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type."));
  },
});

export default upload;
