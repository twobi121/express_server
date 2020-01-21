const service = require('../services/upload');
const multer  = require("multer");

class UploadController {

    constructor() {
    }

    upload = async (req, res) => {
   console.log(req)
        try {
            const storageConfig = multer.diskStorage({
                destination: (req, file, cb) =>{
                    console.log(req)
                    cb(null, "public");
                },
                filename: (req, file, cb) =>{
                    cb(null, file.originalname);
                }
            });

            multer({storage:storageConfig}).single("file")
            res.send('uploaded');
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

}

module.exports = UploadController;