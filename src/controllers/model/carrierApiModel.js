const axios = require('axios');
const https = require('https');

const fs = require("fs");
//const fsp = require("fs").promises;
//const AdmZip = require("adm-zip");

// helpers
const AdmZipHelper = require('../../helpers/admZip')

// validaciones
const Validations = require('../validations/validations');

class CarrierApiModel {
    constructor(api, model) {
        this.model = model
        this.api = api
        this.path = `/home/juan/Documentos/Skydropx-Challenge/src/public/pdfs/`;
        this.zip_url = 'http://localhost:5000/zip/'
    }

    async Shipments(req, res) {
        const shipments = req.body;
        let ids = [], isError = false
        const shipment_data = Validations.isNull(shipments);
        if (shipment_data && shipment_data.length === 0) res.status(400).json({ erro: true, message: 'Ocurrio un error.' });
        else {
            this.Requests(shipment_data).then(results => {
                // valido si ya existe un archivo .zip
                results.forEach(element => {
                    if (element.errors) {
                        isError = true
                    } else {
                        ids.push(element.id)
                        this.Status(element.id)
                    }
                });
                if (isError === true) {
                    res.status(400).json({ erro: true, message: 'Ocurrio un error inesperado, verifique los datos enviados' });
                } else {
                    this.Download(results)
                    res.status(200).json({ error: false, message: 'Etiquetas solicitadas con exito.', labels: ids })
                }
            })
        }
    }

    async Status(shipment_id) {
        const NewStatus = new this.model({ shipment_id })
        await NewStatus.save()
    }

    async changeStatus(shipment_id, label_status, label_status_description) {
        await this.model.findOneAndUpdate({ shipment_id }, { label_status, label_status_description, url: `${this.zip_url + shipment_id}.zip` })
    }

    async Download(urls) {
        // Descarga los PDFs desde el link que devuelve la API
        for (let i in urls) {
            this.changeStatus(urls[i].id, 'processing', 'Processing label generation')
            AdmZipHelper.createZip(urls[i].id, this.path).then(
                await https.get(urls[i].url, (res) => {
                    let filename = urls[i].id, filepath = this.path + filename + '.pdf';
                    const filePath = fs.createWriteStream(filepath);
                    res.pipe(filePath);
                    filePath.on('finish', () => {
                        let zippath = `/home/juan/Documentos/Skydropx-Challenge/src/public/zip/${urls[i].id}.zip`
                        try {
                            AdmZipHelper.UpdateZip(zippath, filepath, filename).then(() => {
                                this.changeStatus(filename, 'completed', 'Label generation completed');
                                this.Remove(filepath);
                            })
                        } catch (error) {
                            this.changeStatus(urls[i].id, 'error', 'Something went wrong during the label generation')
                        }
                    });
                })
            )

        }
    }


    Remove(pathNames) {
        // elimina los PDF descargados luego de comprimirlos
        try {
            fs.unlinkSync(pathNames)
        } catch (error) {
            console.log(`[-] Ocurrio un error: ${error}`);
        }
    }

    async Requests(shipment_data) {
        // Realiza las consultas  a la API y devuelve lo obtenido
        let results = []
        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token token=${process.env.TOKEN}`
            },
            validateStatus: false
        }
        try {
            let i = 0
            for (i; i < shipment_data.length;) {
                const { data } = await axios.post(this.api, shipment_data[i], params)
                if (data['data']) {
                    results.push({ 'id': data.data.id, 'url': data.data.attributes.file_url })
                    i++
                }
                else if (data['errors'] && data['error'] !== []) {
                    results.push(data)
                    i = shipment_data.length;
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            return results
        }
    }
}

module.exports = CarrierApiModel
