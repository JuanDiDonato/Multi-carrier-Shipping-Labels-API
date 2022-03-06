const { Router } = require('express');
const UserControllers = require('../controllers/clients');
const passport = require('passport');
require('../passport')
const router = Router();

router.post('/register', (req,res) => UserControllers.Register(req,res));
router.post('/login', passport.authenticate('local', { session: false }),(req,res) => UserControllers.Login(req,res));
router.get('/logout', passport.authenticate('jwt', { session: false }),(req,res) => UserControllers.Logout(req,res));

module.exports = router