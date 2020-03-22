const multer  = require("multer");
const emitter = require('../emitter');
const mongoose = require('mongoose');
const Albums = require('../models/albums');
const Photos = require('../models/photos');
const Likes = require('../models/likes');
const User = require('../models/user');
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
        await Photos.deleteMany({album_id: id});
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
            const lastphotos = await Photos.find({album_id: album[0]._id}).limit(3).select('-__v');
            return lastphotos;
        }

        return;
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

const getAlbumsWithPhotos = async function(owner_id, loggedUserId) {
    try {
        const albums = await Albums.aggregate([
            {
                $match: {'owner_id' : mongoose.Types.ObjectId(owner_id)}
            }
        ]);

        const sortedPhotos = await Photos.aggregate([
            {
                $match: {'owner_id' : mongoose.Types.ObjectId(owner_id)}
            },
            { $lookup:
            {
                from: 'albums',
                localField: 'album_id',
                foreignField: '_id',
                as: 'album'
            }},
            {$unwind: '$album'},
            {$sort: {date: -1}},
            {$lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'post_id',
                as: 'likes'
            }},
            {$project: {
                _id: 1,
                album: 1,
                date: 1,
                filename: 1,
                album_id: 1,
                owner_id: 1,
                    likes: 1,
                isLiked: {
                    $filter: {
                        input: "$likes",
                        as: "like",
                        cond: { $eq: [ loggedUserId, '$$like.owner_id' ]  }
                    }
                }
            }},
            {$addFields: {
                    isLiked: {
                        $cond: [ {$ne:['$isLiked',[]]},true, false ]
                    },
                    likes: {$size: '$likes'}
                }},
            {$group: {
                    _id: {$year: "$date"},
                    photos: { $push: "$$ROOT"}
                }},
            {$sort: {_id: -1}},


        ]);

        return {albums, sortedPhotos};
    } catch (e) {
        throw new Error(e.message);
    }
}

const getAlbum = async function(id, loggedUserId) {
    try {
        const album = await Albums.aggregate([
            {
                $match: { "_id": mongoose.Types.ObjectId(id)}
            }, {
                $lookup: {
                    from: 'photos',
                    as: 'photos',
                    let: { alb_id: '$_id' },
                    pipeline: [
                        { $match: {
                                $expr: { $eq: [ '$album_id', '$$alb_id' ] }
                            },
                        }, {$lookup: {
                                from: 'likes',
                                localField: '_id',
                                foreignField: 'post_id',
                                as: 'likes'
                            }},
                        {$project: {
                                _id: 1,
                                album: 1,
                                date: 1,
                                filename: 1,
                                album_id: 1,
                                owner_id: 1,
                                likes: 1,
                                isLiked: {
                                    $filter: {
                                        input: "$likes",
                                        as: "like",
                                        cond: { $eq: [ loggedUserId, '$$like.owner_id' ]  }
                                    }
                                }
                            }},
                        {$addFields: {
                                isLiked: {
                                    $cond: [ {$ne:['$isLiked',[]]},true, false ]
                                },
                                likes: {$size: '$likes'}
                            }},]
                }}
                ]);
        return album[0];
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

const updateAlbum = async function(body) {
    try {
        await Albums.findByIdAndUpdate(body.id, {...body});
    } catch (e) {
        throw new Error(e.message);
    }
}

const setLike = async function(owner_id, post_id) {
    try {
        const like = await Likes.find({post_id, owner_id});
        if (!like.length) {
            const newLike = new Likes({post_id, owner_id});
            await newLike.save();
            const photo = await Photos.find({_id: post_id});
            const sender = await User.find({_id: owner_id}).select('-password -tokens -__v');
            if (sender[0]._id.toString() !== photo[0].owner_id.toString()) {
                emitter.emit('like', {photo: photo[0], sender: sender[0]});
            }
            return true;
        } else {
            await Likes.deleteOne({_id: like[0]._id});
            return false;
        }
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
    updateAlbumPreview,
    updateAlbum,
    setLike
}





