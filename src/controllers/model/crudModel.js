// model
const Validations = require('../validations/validations')

class CrudModel {
    constructor(model) {
        this.model = model
    }
    async getById(req, res) {
        const { shipment_id } = req.params
        if (Validations.Exists(this.model, shipment_id)) {
            const data = await this.model.find({ shipment_id })
            const status_response = {
                shipment_id: data[0].shipment_id,
                status: data[0].label_status,
                description: data[0].label_status_description,
                url: data[0].url
            }
            res.status(200).json({ error: false, status_response })
        } else {
            res.status(404).json({ error: true, message: 'Ocurrio un error inesperado.' })
        }

    }

}
module.exports = CrudModel