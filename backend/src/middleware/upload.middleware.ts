import { randomUUID } from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

// Use temp directory for uploads (absolute path)
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/i.test(
      path.extname(file.originalname)
    );
    if (!allowed) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

export const uploadFields = uploadMiddleware.fields([
  { name: "avatar", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "src", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);
