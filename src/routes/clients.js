const { Router } = require('express');
const UserControllers = require('../controllers/clients');
const passport = require('passport');
require('../passport')
const router = Router();

router.post('/register',
    /**
     * @api {post} /labels/client/register Registro
     * @apiName Register
     * @apiGroup Clients
     * @apiDescription Endpoint que registra los clientes del microservicio
     *
     * @apiParam {String} username Nombre de usuario del cliente
     * @apiParam {String} password Contraseña del cliente
     *
     * @apiSuccess {Boolean} Error true o false
     * @apiSuccess {String} Message Descripcion del estado
     * 
     * @apiError {Boolean} Error true o false
     * 
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 40O Bad request
     *     {
     *       "error": true,
     *       "message": "Complete todos los campos."
     *     }
     * 
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 201 CREATED
     *     {
     *       "error": false,
     *       "message": "Cliente creado con exito."
     *     }
     * 
     * 
     * 
     */
    (req, res) => UserControllers.Register(req, res));
router.post('/login', passport.authenticate('local', { session: false }),
    /**
     * @api {post} /labels/client/login Login
     * @apiName Login
     * @apiGroup Clients
     * @apiDescription Endpoint que inicia sesion de los clientes
     *
     * @apiParam {String} username Nombre de usuario del cliente
     * @apiParam {String} password Contraseña del cliente
     *
     * @apiSuccess {Boolean} Error true o false
     * 
     * @apiError {String} Unautorized
     * 
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 401 Unautorized
     *     {
     *       Unautorized
     *     }
     * 
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "error": false,
     *     }
     * 
     */ (req, res) => UserControllers.Login(req, res));
router.get('/logout', passport.authenticate('jwt', { session: false }),
    /**
     * @api {get} /labels/client/logout Logout
     * @apiName Logout
     * @apiGroup Clients
     * @apiDescription Endpoint que cierra la sesion de los clientes
     * 
     * @apiSuccess {String} Username String vacio
     * @apiSuccess {String} Password String vacio
     * @apiSuccess {Boolean} Error false
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "error": false,
     *       "user": { username: '', password: '' },
     *     }
     * 
     */(req, res) => UserControllers.Logout(req, res));

module.exports = router