const service = require('../services/user');

class UserController {

    constructor() {
    }

    getUsers = async (req, res) => {
        try {
            const result = await service.getUsers();
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    addUser = async (req, res) => {
        try {
            const result = await service.addUser(req.body);
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    getUserById = async (req, res) => {
        try {
            const result = await service.getUserById(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    deleteUserById = async (req, res) => {
        try {
            const result = await service.deleteUserById(req.params.id);
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

    updateUserById = async (req, res) => {
        try {
            const result = await service.updateUserById(req.params.id, req.body);
            res.status(201).send(result);
        } catch (e) {
            res.status(400).send({error: e.message});
        }
    }

    getUserPetsById = async (req, res) => {
        try {
            const result = await service.getUserPetsById(req.body.id);
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    getAllUsersWithPets = async (req, res) => {
        try {
            const result = await service.getAllUsersWithPets();
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    getUserPets = async (req, res) => {
        try {
            const result = await service.getUserPets(req.params.id);
            res.send(result);
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }
}

module.exports = UserController;