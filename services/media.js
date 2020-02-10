const multer  = require("multer");
const mongoose = require('mongoose');
const Albums = require('../models/albums');
const Photos = require('../models/photos');

const createAlbum = async function(data) {
    try {
        const album = new Albums({...data});
        await album.save();
        return `Альбом успешно добавлен`;
    } catch (e) {
        throw new Error(e.message);
    }
}

const lastphotos = async function(id) {
    try {
        let lastphotos;
        let _id;
        const album = new Promise (Albums.find({$and: [ {owner_id: id}, {main: true}]}))
            .then(async data => {
                _id = data._id;
                lastphotos = await Photos.find({_id})
                console.log(lastphotos)
            } )
            .then(() => console.log(lastphotos));
        console.log(album)
        return album



        // return await Albums.aggregate([
        //     {
        //         $match: {$and: [ {"owner_id": id}, {"main": true}]}
        //     },
        //     {
        //         $lookup:
        //             {
        //                 from: 'photos',
        //                 localField: '_id',
        //                 foreignField: 'album_id',
        //                 as: 'photos'
        //             }
        //     }
        // ])
    } catch (e) {
        throw new Error(e.message);
    }
}

const upload = async function(file, album_id, owner_id) {
    const filename = file.filename;
    const photo = new Photos({filename, album_id, owner_id} );
    photo.save();
}

module.exports = {
    createAlbum,
    lastphotos,
    upload
}





