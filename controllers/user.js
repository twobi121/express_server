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

    addUser     = async (req, res) => {
        try {
            console.log(req.valid)
            const result = await service.addUser(req.valid);
            res.status(201).send(JSON.stringify(result));
        } catch (e) {
            res.status(400).send({error:e.message});
        }
    }

    getUserLogin = (req, res) => {
        try {
            const result = req.user.login;
            res.send(JSON.stringify(result));
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

    getUserByLogin = async (req, res) => {
        try {
            const result = await service.getUserByLogin(req.params.login, req.user._id);
            console.log(result)
            const user = result[0];
            res.send(user);
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

    login = async (req, res) => {
        try {
            const result = await service.login(req.body.login, req.body.password)
            res.status(201).send(result)
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }

    logout = async (req, res) => {
        try {
            await service.logout(req)
            res.send({responce: "successfully logout"})
        } catch (e) {
            res.status(400).send({error:e.message})
        }
    }

    getLogo = async (req, res) => {
        try {
            const logo = await service.getLogo();
            res.send(logo);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    createRequest = async (req, res) => {
        try {
            const data = {owner_id: req.body.id, sender_id: req.user._id};
            await service.createRequest(data);
            res.send({responce: "successfully send"});
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    getRequests = async (req, res) => {
        try {
            const requests = await service.getRequests(req.user._id);
            res.send(requests);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    acceptRequest = async (req, res) => {
        try {
            await service.acceptRequest(req.body.id);
            res.send({responce: "successfully accepted"});
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    declineRequest = async (req, res) => {
        try {
            await service.declineRequest(req.body.id);
            res.send({responce: "successfully declined"});
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    getFriends = async (req, res) => {
        try {
            const friends = await service.getFriends(req.params.login);
            res.send(friends);
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }

    unfriend = async (req, res) => {
        try {
            await service.unfriend(req.body.id);
            res.send(JSON.stringify("Друг удален"));
        } catch (e) {
            res.status(400).send({error: e.message})
        }
    }



}

module.exports = UserController;
