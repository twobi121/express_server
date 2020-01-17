const express = require('express');

const PetsController = require('./pets_contr');

const pets_controller = new PetsController();

const router = new express.Router();

router.get('/', pets_controller.getPets);
router.post('/', pets_controller.addPets);
router.get('/:id', pets_controller.getPetsById);
router.delete('/:id', pets_controller.deletePetsById);
router.put('/:id', pets_controller.updatePetsById);

module.exports = router;