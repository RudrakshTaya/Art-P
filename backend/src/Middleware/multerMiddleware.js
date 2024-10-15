const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define the storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../public/ProductImages'); // Adjust path as necessary

        // Create the directory if it doesn't exist
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, dir);
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original filename or modify as needed
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

// Export the upload middleware
module.exports = upload;
