/* Controlador para verificar el estado de la etiqueta */

const Status = require('../models/status')

class StatusControllers{
    async Get(req,res){
        const {shipment_id} = req.params
        console.log(shipment_id);
        Status.find({shipment_id}).then(data => {
            const status = {
                shipment_id: data[0].shipment_id,
                status: data[0].label_status,
                description : data[0].label_status_description,
                url: data[0].url
                //http://localhost:5000/zip/labels.zip
            }
            res.status(200).json({error:false,status})
        })
    }
}

module.exports = new StatusControllers()