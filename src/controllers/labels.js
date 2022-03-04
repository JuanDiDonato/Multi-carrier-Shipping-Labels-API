// models
const CarrierApiModel = require('./model/carrierApiModel');
const Status = require('../models/status')

/*
Para crear un controlador con los metodos del modelo, solo pasado la base de datos y la url de la API :
*/ 

const LabelController = new CarrierApiModel(process.env.API_URL,Status)

/*

Para crear un controlador para otra API, si es necesario modificar un metodo :

class LabelController extends LabelModel {
    constructor(){
        super()
        this.model = Status
        this.api = process.env.API_URL
    }
}
*/


module.exports = LabelController