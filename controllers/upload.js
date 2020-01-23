class UploadController {

    constructor() {
    }

    upload = (req, res) => {
        let filedata = req.file;
        if(filedata) {
            res.status(200).send("Файл загружен");
        }
        else {
            res.status(400).send("Ошибка при загрузке файла");
        }
    }
}

module.exports = UploadController;