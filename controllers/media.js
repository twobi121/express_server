const userService = require('../services/user');
const mediaService = require('../services/media')

class MediaController {

    constructor() {
    }

    uploadAvatar = (req, res) => {
        const filedata = req.file;
        if (filedata) {
            userService.updateUserById(req.user._id, {avatar: filedata})
            res.status(200).send(JSON.stringify("Файл загружен"));
        }
        else {
            res.status(400).send(JSON.stringify("Ошибка при загрузке файла"));
        }
    }


    // getAlbums = (req, res) => {
    //     const filedata = req.file;
    //     if (filedata) {
    //         userService.updateUserById(req.user._id, {avatar: filedata})
    //         res.status(200).send(JSON.stringify("Файл загружен"));
    //     }
    //     else {
    //         res.status(400).send(JSON.stringify("Ошибка при загрузке файла"));
    //     }
    // }

    createAlbum = (req, res) => {
        try {
            mediaService.createAlbum(req.body);
            res.status(200).send(JSON.stringify("Альбом успешно создан"));
        } catch (e) {
            res.status(400).send({error: e.message})
        }

    }

    lastphotos = async (req, res) => {
        try {
            const photos = await mediaService.lastphotos(req.user._id);
            res.send(photos);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    upload = async (req, res) => {
        if (req.file) {
            await mediaService.upload(req.file, req.headers.album_id, req.headers.owner_id);
            res.status(200).send(JSON.stringify("Файл загружен"));
        }
        else {
            res.status(400).send(JSON.stringify("Ошибка при загрузке файла"));
        }
    }
}

module.exports = MediaController;
