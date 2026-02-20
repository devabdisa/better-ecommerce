import path from "path";
import express, { Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Cloudinary storage so uploaded images are stored in the cloud
// and persist across Render restarts/redeployments
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    // @ts-ignore
    folder: "ethio-panda",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, quality: "auto", fetch_format: "auto" }],
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    // @ts-ignore
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req: Request, res: Response) => {
  uploadSingleImage(req, res, (err: any) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (req.file) {
      // Cloudinary returns the secure_url on req.file.path
      res.status(200).send({
        message: "Image uploaded successfully",
        image: req.file.path, // This is the full Cloudinary HTTPS URL
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
