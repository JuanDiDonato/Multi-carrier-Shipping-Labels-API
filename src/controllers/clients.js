const jwt = require('jsonwebtoken')
const bcrypt = require('../helpers/bcrypt')
const Client = require('../models/client')

// validations
const Validations = require('./validations/validations');

class UserControllers {

    signToken(id) {
        return jwt.sign({
            iss: 'test',
            sub: id
        }, process.env.SECRET, { expiresIn: '1h' });
    }

    async Register(req, res) {
        const { username, password } = req.body;
        if (!Validations.notNull({ username, password })) {
            res.status(400).json({ error: true, message: 'Complete todos los campos.' });
        } else {
            const data = await Client.findOne({ username });
            if (data) res.status(400).json({ error: true, message: 'Este cliente ya existe.' });
            else {
                const user = new Client({ username, password });
                user.password = await bcrypt.EncryptPassword(password);
                user.save();
                res.status(201).json({ error: false, message: 'Cliente creado con exito' });
            }
        }
    }
    async Login(req, res) {

        if (req.isAuthenticated()) {
            const { _id } = req.user;
            let token = this.signToken(_id);
            res.cookie('access_token', token, { httpOnly: true, sameSite: true });
            res.status(200).json({ error: false });
        }
    }

    Logout(req, res) {
        res.clearCookie('access_token');
        res.status(200).json({
            user: { username: '', password: '' },
            error: false
        });
    }

}

module.exports = new UserControllers()