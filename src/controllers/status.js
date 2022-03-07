/* Controlador para verificar el estado de la etiqueta */
const fs = require('fs'), { pipeline } = require('stream'), path = require('path')

const Status = require('../models/status');
const Validations = require('./validations/validations');

class StatusControllers {

    // obtiene el estado de la etiqueda solicitada de un cliente
    async getById(req, res) {
        const { label_id } = req.body
        const { _id } = req.user;
        const exist = await Validations.Exists(Status, label_id, _id)
        if (exist) {
            Status.find({ _id: label_id }).then(data => {
                const status = {
                    label_id: data[0]._id,
                    status: data[0].label_status,
                    description: data[0].label_status_description,
                    url: data[0].url
                }
                res.status(200).json({ error: false, status })
            })
        } else res.status(404).json({ error: true, message: 'Ocurrio un error inesperado.' })
    }

    // retorna los datos del zip de un cliente
    async getZipData(req, res) {
        const { label_id } = req.params;
        const { _id } = req.user;
        if (Validations.notNull({ _id })) {
            Validations.Exists(Status, label_id, _id).then(
                data => {
                    if (!data) res.status(404).json({
                        error: true, message: 'Ocurrio un error inesperado.'
                    })
                    else {
                        const zip_path = path.join(__dirname.split('/controllers')[0], 'public', 'zip', `${label_id}.zip`)
                        let file = fs.createReadStream(zip_path);
                        res.setHeader('Content-Type', 'application/zip');
                        pipeline(file, res, (error) => {
                            if (error) console.log(error);
                        })
                    }
                }
            )

        } else {
            res.status(400).json({ error: true, message: 'Ocurrio un error inesperado.' })
        }
    }

    // crea una nueva instancia para un zip.
    async Status(client) {
        const newStatus = new Status({ client });
        await newStatus.save();
        return newStatus._id.toString()
    }

    // modifica la instancia de un zip.
    async changeStatus(_id, label_status, label_status_description, url) {
        await Status.findOneAndUpdate({ _id }, { label_status, label_status_description, url })
    }


}

module.exports = new StatusControllers()

