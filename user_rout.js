const express = require('express');

const UserController = require('./user_contr');

const user_controller = new UserController();

const router = new express.Router();

router.get('/pets', user_controller.getAllUsersWithPets);
// router.get('/:id/pet', user_controller.getUserPets);router.get('/:id/pet', user_controller.getUserPets);
router.get('/:id/pets', user_controller.getUserPets);
router.get('/', user_controller.getUsers);
router.post('/', user_controller.addUser);
router.get('/:id', user_controller.getUserById);
router.delete('/:id', user_controller.deleteUserById);
router.put('/:id', user_controller.updateUserById);


module.exports = router;