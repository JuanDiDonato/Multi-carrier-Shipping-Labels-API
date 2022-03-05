const axios = require('axios');
const https = require('https');
const fs = require("fs");

// models
const StatusControllers = require('./status');
const Carries = require('./model/carriers');

// helpers
const AdmZipHelper = require('../helpers/admZip');

// validaciones
const Validations = require('./validations/validations');

class LabelController {
    constructor() {
        this.path = `/home/juan/Documentos/Skydropx-Challenge/src/public/pdfs/`;
        this.zip_url = 'http://localhost:5000/zip/';
        this.zip_path = `/home/juan/Documentos/Skydropx-Challenge/src/public/zip/labels.zip`;
    }

    async Shipments(req, res) {
        const shipments = req.body;
        let ids = [], isError = false
        const shipments_data = Validations.isNull(shipments);
        if (shipments_data && shipments_data.length === 0) {
            res.status(400).json({ erro: true, message: 'Ocurrio un error.' });
        }
        else {
            this.Requests(shipments_data).then(results => {
                results.forEach(element => {
                    if (element.errors) {
                        isError = true;
                    } else {
                        ids.push(element.id);
                        StatusControllers.Status(element.id);
                    }
                });
                if (isError === true) {
                    res.status(400).json({ erro: true, message: 'Ocurrio un error inesperado, verifique los datos enviados' });
                } else {
                    let zip = AdmZipHelper.Read(this.zip_path)
                    if (zip.length === 0) {
                        AdmZipHelper.createZip(this.path)
                    }
                    this.Download(results)
                    res.status(200).json({ error: false, message: 'Etiquetas solicitadas con exito.', labels: ids })
                }
            })
        }
    }

    // Descarga los PDFs desde el link que devuelve la API
    async Download(urls) {

        /*
        Inicia el proceso para obtener la etiqueta
        Recorre todas las URLs recibidas, y crea un Zip para cada una con el id de la solicitud.
        Luego agrega al Zip el PDF descargado y guarda su link de descarga.
        */

        let count = 0, filesnames = [];
        for (let i in urls) {
            StatusControllers.changeStatus(urls[i].id, 'processing', 'Processing label generation');
            await https.get(urls[i].url, (res) => {
                let filename = urls[i].id, filepath = this.path + filename + '.pdf';
                filesnames.push(filename);
                const filePath = fs.createWriteStream(filepath);
                res.pipe(filePath);
                filePath.on('finish', () => {
                    count = count + 1;
                    if (count === urls.length) {
                        try {
                            AdmZipHelper.UpdateZip(this.zip_path, this.path, filesnames).then(() => {
                                StatusControllers.changeStatus(filename, 'completed', 'Label generation completed', `${this.zip_url + filename}.zip`);
                                this.Remove(filesnames);
                            })
                        } catch (error) {
                            StatusControllers.changeStatus(urls[i].id, 'error', 'Something went wrong during the label generation');
                        }
                    }
                });
            })
        }
    }

    // Elimina los PDF descargados luego de comprimirlos
    Remove(filesnames) {
        filesnames.forEach(filename => {
            try {
                fs.unlinkSync(this.path + filename + '.pdf')
            } catch (error) {
                console.log(`[-] Ocurrio un error: ${error}`);
            }
        });

    }

    // Realiza las consultas a la API deseada y retorna los resultados
    async Requests(shipments_data) {
        let results = [], i = 0;

        /* Recorre los datos del body, 
        obtiene los carries de cada uno y 
        efectua las consultas */

        for (i; i < shipments_data.length;) {
            const carrier = shipments_data[i].carrier;
            try {
                switch (carrier) {

                    // fake carrier api
                    case "fake_carrier":
                        const data = await Carries.FakeCarrier(shipments_data[i]);
                        results.push(data);
                        if (data.errors) {
                            i = shipments_data.length;
                        }
                        i++;
                        break;

                    /*
                    case "otro_carrier":
                        ...
                        break;
                    */

                    default:
                        break;
                }
            } catch (error) {
                console.log(`[-] Ocurrio un error: ${error}`);
            }
        }
        return results;
    }
}

module.exports = new LabelController()















/*
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
    for (i; i < shipments_data.length;) {
        const carrier = shipments_data[i].carrier
        const { data } = await axios.post(this.api, shipments_data[i], params)
        if (data['data']) {
            results.push({ 'id': data.data.id, 'url': data.data.attributes.file_url })
            i++
        }
        else if (data['errors'] && data['error'] !== []) {
            results.push(data)
            i = shipments_data.length;
        }
    }
} catch (error) {
    console.log(error);
} finally {
    return results
}
*/