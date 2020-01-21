const express = require('express');
const auth = require('../middleware/auth');

const UserController = require('../controllers/user');

const user_controller = new UserController();

const router = new express.Router();

router.get('/pets', user_controller.getAllUsersWithPets);
router.get('/:id/pets', user_controller.getUserPets);//возвращает овнера с петами внутри
router.get('/:id/petss', user_controller.getUserPetsById);//возвращает петов с объектом овнера внутри
router.get('/', user_controller.getUsers);
router.post('/login', user_controller.login);
router.post('/logout', auth, user_controller.logout);
// router.post('/logout', user_controller.logout);
router.post('/add', user_controller.addUser);
router.get('/:id', user_controller.getUserById);
router.delete('/:id', user_controller.deleteUserById);
router.put('/:id', user_controller.updateUserById);



module.exports = router;