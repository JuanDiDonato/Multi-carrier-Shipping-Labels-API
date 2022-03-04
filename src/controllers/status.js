/* Controlador para verificar el estado de la etiqueta */

const Status = require('../models/status');
const CrudModel = require('./model/crudModel');

const StatusController = new CrudModel(Status)

module.exports = StatusController
/*

class StatusControllers{
    // obtiene el estado de la etiqueda solicitada
    async Get(req,res){
        const {shipment_id} = req.params
        Status.find({shipment_id}).then(data => {
            const status = {
                shipment_id: data[0].shipment_id,
                status: data[0].label_status,
                description : data[0].label_status_description,
                url: data[0].url
            }
            res.status(200).json({error:false,status})
        })
    }
}

module.exports = new StatusControllers()
*/
