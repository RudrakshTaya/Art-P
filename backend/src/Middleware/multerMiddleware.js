const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // To generate unique filenames

// Define the storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../public/ProductImages'); // Adjust path as necessary

        // Create the directory if it doesn't exist
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                console.error("Error creating directory:", err);
                return cb(err);
            }
            cb(null, dir);
        });
    },
    filename: function (req, file, cb) {
        const uniqueName = `${uuidv4()}-${file.originalname}`; // Create a unique filename
        cb(null, uniqueName);
    }
});

// File filter to allow only certain file types (e.g., images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only images are allowed (jpeg, jpg, png, gif)."));
    }
};

// Initialize multer with the defined storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Export the upload middleware
module.exports = upload;
