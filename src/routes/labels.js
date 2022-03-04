const { Router } = require('express');
const LabelControllers = require('../controllers/labels');
const StatusControllers = require('../controllers/status');
const router = Router();

router.post('/', (req,res) => LabelControllers.Shipments(req,res));
router.get('/:shipment_id', (req,res) => StatusControllers.Get(req,res));

module.exports = router