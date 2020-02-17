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
            const photos = await mediaService.lastphotos(req.params.id);
            res.send(photos);
        } catch (e) {
            res.status(400).send({error: e.mess})
        }
    }

    upload = async (req, res) => {
        if (req.file) {
            await mediaService.upload(req.file, req.headers.album_id, req.user.id);
            res.status(200).send(JSON.stringify("Файл загружен"));
        }
        else {
            res.status(400).send(JSON.stringify("Ошибка при загрузке файла"));
        }
    }

    getAlbums = async (req, res) => {
        try {
            const albums = await mediaService.getAlbums(req.params.id);
            res.send(albums);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    getAlbum = async (req, res) => {
        try {
            const album = await mediaService.getAlbum(req.params.id);
            console.log(album)
            res.send(album);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }


}

module.exports = MediaController;
