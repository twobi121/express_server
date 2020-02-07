const multer  = require("multer");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const config = multer({storage:storageConfig}).single("file")

module.exports = config;
