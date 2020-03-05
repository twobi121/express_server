const express = require('express');
const auth = require('../middleware/auth');
const valid = require('../middleware/validation');
const validSchema = require('../utils/validation_schemas');

const UserController = require('../controllers/user');

const user_controller = new UserController();

const router = new express.Router();
router.get('/requests', auth, user_controller.getRequests);
router.get('/pets', user_controller.getAllUsersWithPets);
router.get('/:login/friends', user_controller.getFriends);
router.get('/:id/pets', user_controller.getUserPets);//возвращает овнера с петами внутри
router.get('/:id/petss', user_controller.getUserPetsById);//возвращает петов с объектом овнера внутри
router.get('/user', auth, user_controller.getUserLogin);
router.get('/loggedUser', auth, user_controller.getLoggedUser);
router.get('/:login', user_controller.getUserByLogin);
router.get('/:login/isFriend', auth, user_controller.getIsFriend);
router.get('/', user_controller.getUsers);
router.post('/login', user_controller.login);
router.post('/search', user_controller.search);
router.post('/logout', auth, user_controller.logout);
router.post('/add', valid(validSchema.userSchema), user_controller.addUser);
router.post('/request', auth, user_controller.createRequest);
router.post('/accept', auth, user_controller.acceptRequest);
router.post('/decline', auth, user_controller.declineRequest);
router.post('/unfriend', auth, user_controller.unfriend);
router.get('/logo', user_controller.getLogo);
router.delete('/:id', user_controller.deleteUserById);
router.put('/:id', valid(validSchema.userSchema), user_controller.updateUserById);



module.exports = router;
