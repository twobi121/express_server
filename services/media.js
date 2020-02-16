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
        const album = await Albums.find({$and: [ {owner_id: id}, {main: true}]});

        if (album.length) {
            const lastphotos = await Photos.find({album_id: album[0]._id}).limit(3);
            return {id: album[0]._id, lastphotos: lastphotos}
        }

        return;




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
    if(!album_id) {
        const album = await Albums.find({$and: [ {owner_id}, {main: true}]});
        album_id = album[0]._id
    }
    const photo = new Photos({filename, album_id, owner_id} );
    photo.save();
}

const getAlbums = async function(id) {
    const albums = await Albums.aggregate([
        {
            $match: {'owner_id' : mongoose.Types.ObjectId(id)}
        }
    ]);

    const photos = await Photos.aggregate([
        {
            $match: {'owner_id' : mongoose.Types.ObjectId(id)}
        },
        { $lookup:
        {
            from: 'albums',
            localField: 'album_id',
            foreignField: '_id',
            as: 'albums'
        }},
        {$group: {
                _id: {$year: "$date"},
                filenames: { $push: "$$ROOT"}

            }},
        {$sort: {_id: -1}}
    ]);

    return {albums, photos};
}



module.exports = {
    createAlbum,
    lastphotos,
    upload,
    getAlbums
}





