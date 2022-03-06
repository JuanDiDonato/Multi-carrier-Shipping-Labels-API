/* Controlador para verificar el estado de la etiqueta */

const Status = require('../models/status');
const Validations = require('./validations/validations');

class StatusControllers {
    // obtiene el estado de la etiqueda solicitada
    async getById(req, res) {
        const { _id } = req.body
        const exist = await Validations.Exists(Status, _id)
        if (exist) {
            Status.find({ _id }).then(data => {
                const status = {
                    id: data[0]._id,
                    status: data[0].label_status,
                    description: data[0].label_status_description,
                    url: data[0].url
                }
                res.status(200).json({ error: false, status })
            })
        } else res.status(404).json({ error: true, message: 'Ocurrio un error inesperado.' })
    }

    async Status() {
        const newStatus = new Status();
        await newStatus.save();
        return newStatus._id.toString()
    }

    async changeStatus(_id, label_status, label_status_description,url) {
        await Status.findOneAndUpdate({ _id }, { label_status, label_status_description, url })
    }
}

module.exports = new StatusControllers()

