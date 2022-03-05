/* Controlador para verificar el estado de la etiqueta */

const Status = require('../models/status');
const Validations = require('./validations/validations');

class StatusControllers {
    // obtiene el estado de la etiqueda solicitada
    async getById(req, res) {
        const { shipment_id } = req.body
        const exist = await Validations.Exists(Status, shipment_id)
        if (exist) {
            Status.find({ shipment_id }).then(data => {
                const status = {
                    shipment_id: data[0].shipment_id,
                    status: data[0].label_status,
                    description: data[0].label_status_description,
                    url: data[0].url
                }
                res.status(200).json({ error: false, status })
            })
        } else res.status(404).json({ error: true, message: 'Ocurrio un error inesperado.' })
    }

    async Status(shipment_id) {
        const NewStatus = new Status({ shipment_id });
        await NewStatus.save();
    }

    async changeStatus(shipment_id, label_status, label_status_description,url) {
        await Status.findOneAndUpdate({ shipment_id }, { label_status, label_status_description, url })
    }
}

module.exports = new StatusControllers()

