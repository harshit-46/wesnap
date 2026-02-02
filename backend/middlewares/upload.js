const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const createUploader = (folder) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder,
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            transformation: folder === "avatars"
                ? [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
                : [{ width: 600, height: 600, crop: "fill", gravity: "auto" }]
        }
    });

    return multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }
    });
};

module.exports = createUploader;