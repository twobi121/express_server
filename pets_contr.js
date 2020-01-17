const service = require('./pets_serv');

class PetsController {

    constructor() {
    }

    getPets = async (req, res) => {
        try {
            const result = await service.getPets();
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    addPets = async (req, res) => {
        try {
            const result = await service.addPets(req.body);
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    getPetsById = async (req, res) => {
        try {
            const result = await service.getPetsById(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    deletePetsById = async (req, res) => {
        try {
            const result = await service.deletePetsById(req.params.id);
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

    updatePetsById = async (req, res) => {
        try {
            const result = await service.updatePetsById(req.params.id, req.body);
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }



}

module.exports = PetsController;