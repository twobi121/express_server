const multer  = require("multer");
const mongoose = require('mongoose');
const Albums = require('../models/albums');
const Photos = require('../models/photos');

const createAlbum = async function(data) {
    try {
        const album = new Albums({...data});
        await album.save();
        return album._id;
    } catch (e) {
        throw new Error(e.message);
    }
}

const deleteAlbum = async function(id) {
    try {
        await Albums.deleteOne({_id: id});
    } catch (e) {
        throw new Error(e.message);
    }
}

const deletePhoto = async function(id) {
    try {
        await Photos.deleteOne({_id: id});
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
    try {
        const filename = file.filename;
        let album;

        if(!album_id) {
            album = await Albums.find({$and: [ {owner_id}, {main: true}]});
            album_id = album[0]._id
        } else album = await Albums.find({_id: album_id});

        if(!album[0].preview || album[0].preview === 'avatar-default.png') {
           await Albums.findByIdAndUpdate(album_id, {preview : file.filename});
        }

        const photo = new Photos({filename, album_id, owner_id} );
        photo.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const getAlbums = async function(id) {
    try {
        const albums = await Albums.aggregate([
            {
                $match: {'owner_id': mongoose.Types.ObjectId(id)}
            }
        ]);

        return albums;
    } catch (e) {
        throw new Error(e.message);
    }
}

const getAlbumsWithPhotos = async function(id) {
    try {
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
            {$sort: {date: -1}},
            {$group: {
                    _id: {$year: "$date"},
                    filenames: { $push: "$$ROOT"}
                }},
            {$sort: {_id: -1}},

        ]);

        return {albums, photos};
    } catch (e) {
        throw new Error(e.message);
    }
}

const getAlbum = async function(id) {
    try {
        const album = await Albums.aggregate([
            {
                $match: { "_id": mongoose.Types.ObjectId(id)}
            },
                    {
                        $lookup:
                            {
                                from: 'photos',
                                localField: '_id',
                                foreignField: 'album_id',
                                as: 'photos'
                            }
                    }
                ])
        return album;
    } catch (e) {
        throw new Error(e.message);
    }
}

const updateAlbumPreview = async function(ids) {
    try {
        await Albums.findByIdAndUpdate(ids.albumId, {preview: ids.filename});
    } catch (e) {
        throw new Error(e.message);
    }
}



module.exports = {
    createAlbum,
    deleteAlbum,
    deletePhoto,
    lastphotos,
    upload,
    getAlbums,
    getAlbumsWithPhotos,
    getAlbum,
    updateAlbumPreview
}





