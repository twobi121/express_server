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

    createAlbum = async (req, res) => {
        try {
            req.body.owner_id = req.user._id;
            const albumId = await mediaService.createAlbum(req.body);
            res.status(200).send(albumId);
        } catch (e) {
            res.status(400).send({error: e.message})
        }

    }

    deleteAlbum = async (req, res) => {
        try {
            await mediaService.deleteAlbum(req.params.id);
            res.status(200).send(JSON.stringify('Альбом успешно удален'));
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    deletePhoto = async (req, res) => {
        try {
            await mediaService.deletePhoto(req.params.id);
            res.status(200).send(JSON.stringify('Фото успешно удалено'));
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    lastphotos = async (req, res) => {
        try {
            const photos = await mediaService.lastphotos(req.params.id);
            res.status(200).send(photos);
        } catch (e) {
            res.status(400).send({error: e.mess})
        }
    }

    upload = async (req, res) => {
        if (req.file) {
            await mediaService.upload(req.file, req.params.albumId, req.user.id);
            res.status(200).send(JSON.stringify("Файл загружен"));
        }
        else {
            res.status(400).send(JSON.stringify("Ошибка при загрузке файла"));
        }
    }

    getAlbumsWithPhotos = async (req, res) => {
        try {
            const albums = await mediaService.getAlbumsWithPhotos(req.params.id);
            res.status(200).send(albums);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    getAlbum = async (req, res) => {
        try {
            const album = await mediaService.getAlbum(req.params.id);
            res.status(200).send(album);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    getAlbums = async (req, res) => {
        try {
            const albums = await mediaService.getAlbums(req.params.id);
            res.status(200).send(albums);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    updateAlbumPreview = async (req, res) => {
        try {
            await mediaService.updateAlbumPreview(req.body);
            res.status(200).send(JSON.stringify("Обложка обновлена"));
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

}

module.exports = MediaController;
