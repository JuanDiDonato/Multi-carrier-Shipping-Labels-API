const { Router } = require('express');
const LabelControllers = require('../controllers/labels');
const StatusControllers = require('../controllers/status');
const passport = require('passport');
require('../passport')
const router = Router();

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => LabelControllers.Shipments(req,res));
router.post('/check', passport.authenticate('jwt', { session: false }), (req, res) => StatusControllers.getById(req, res));
router.get('/check/:_id', (req, res) => StatusControllers.getZipData(req,res));

module.exports = router