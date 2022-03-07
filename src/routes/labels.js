const { Router } = require('express');
const LabelControllers = require('../controllers/labels');
const StatusControllers = require('../controllers/status');
const passport = require('passport');
require('../passport')
const router = Router();

router.post('/', passport.authenticate('jwt', { session: false }),
    /**
     * @api {post} /labels/ Creacion de etiquetas
     * @apiName Labels
     * @apiGroup Labels
     * @apiDescription Endpoint que crea una solicitud de generacion de etiquetas
     *
     * @apiParam {String} Carrier Nombre del transportador del paquete
     * @apiParam {Object} Shipment Datos de envio del paquete
     *
     * @apiSuccess {Boolean} Error true o false
     * @apiSuccess {String} Message Descripcion del estado
     * @apiSuccess {String} Id Id de solicitud.

     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 CREATED
     *     {
     *       "error": false,
     *       "message": 'Etiquetas solicitadas con exito.',
     *       "id" : "6224da76c41954e5d4093041"
     *     }
     * 
     * 
     * 
     */ (req, res) => LabelControllers.Shipments(req, res));
router.post('/status', passport.authenticate('jwt', { session: false }),
    /**
     * @api {post} /labels/status Verificacion del estado de etiquetas
     * @apiName Status
     * @apiGroup Status
     * @apiDescription Endpoint que devuelve el estado de la etiqueta
     *
     * @apiParam {String} label_id Id del la solicitud de etiqueta
     *
     * @apiSuccess {Boolean} Error true o false
     * @apiSuccess {Object} Status Estado de la etiqueta
     * 
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
	 *          "error": false,
	 *          "status": {
	 *          "id": "622512aa027ec9805e531621",
	 *          "status": "completed",
	 *          "description": "Label generation completed",
	 *          "url": "http://localhost:5000/zip/622512aa027ec9805e531621.zip" }
     *      }
     * 
     * @apiError {Boolean} Error true o false
     * @apiError {Boolean} Message Descripcion del error
     * 
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 40O Bad request
     *     {
     *       "error": true,
     *       "message": "Ocurrio un error inesperado."
     *     }
     * 
     * 
     */ (req, res) => StatusControllers.getById(req, res));
router.get('/status/:label_id', passport.authenticate('jwt', { session: false }),
    /**
     * @api {get} /labels/status/:label_id Obtener ZIP
     * @apiName Zip
     * @apiGroup Status
     * @apiDescription Endpoint que devuelve el contenido del Zip correspondiente
     *
     * @apiParam {String} Id Id del la solicitud de etiqueta
     * @apiSuccess {String} Contenido Contenido del Zip.
     * @apiError {Boolean} Error true o false
     * @apiError {Boolean} Message Descripcion del error
     * 
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 40O Bad request
     *     {
     *       "error": true,
     *       "message": "Ocurrio un error inesperado."
     *     }
     * 
     * 
     */(req, res) => StatusControllers.getZipData(req, res));

module.exports = router