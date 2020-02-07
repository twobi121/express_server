const userService = require('../services/user');

class UploadController {

    constructor() {
    }

    upload = (req, res) => {
        const filedata = req.file;
        if (filedata) {
            userService.updateUserById(req.user._id, {avatar: filedata})
            res.status(200).send(JSON.stringify("Файл загружен"));
        }
        else {
            res.status(400).send(JSON.stringify("Ошибка при загрузке файла"));
        }
    }
}

module.exports = UploadController;
