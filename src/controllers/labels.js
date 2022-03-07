const path = require('path'), https = require('https'), fs = require("fs");

// models
const StatusControllers = require('./status'), Carries = require('./model/carriers');

// helpers
const AdmZipHelper = require('../helpers/admZip');

// validaciones
const Validations = require('./validations/validations');

class LabelController {
    constructor() {
        this.path = __dirname.split('/controllers')[0];
        this.pdfs_path = path.join(this.path, '/public', 'pdfs/');
        this.zip_path = path.join(this.path, '/public', 'zip/');
        this.zip_url = process.env.FILE_URL
    }

    async Shipments(req, res) {

        /* 
        Obtiene y valida los datos del body.
        Si supera la validacion, llama a Requests para hacer las consultas a las APIs
         */

        const shipments = req.body;
        const {_id} = req.user
        const shipments_data = Validations.isNull(shipments);
        
        if (shipments_data && shipments_data.length === 0) {
            res.status(400).json({ error: true, message: 'Ocurrio un error.' });
        }
        else {
            const id = await StatusControllers.Status(_id); // crea la instancia en la base de datos
            res.status(200).json({ error: false, message: 'Etiquetas solicitadas con exito.', id: id })
            this.Requests(shipments_data, id).then(async results => {
                if (results.length > 0) {
                    this.Download(results, id);
                } else {
                    StatusControllers.changeStatus(id, 'error', 'Something went wrong during the label generation');
                }
            })
        }
    }

    // Descarga los PDFs desde el link que devuelve la API
    async Download(urls, id) {

        /*
        Inicia el proceso para obtener la etiqueta
        Recorre todas las URLs recibidas, y crea un Zip ellas con los PDFs descargados.
        Luego agrega al Zip los PDFs descargados y guarda su link de descarga.
        */

        let count = 0, filesnames = [];
        StatusControllers.changeStatus(id, 'processing', 'Processing label generation');
        for (let i in urls) {
            let filename = urls[i].id
            await https.get(urls[i].url, (res) => {
                let filepath = this.pdfs_path + filename + '.pdf';
                filesnames.push(filename);
                const filePath = fs.createWriteStream(filepath);
                res.pipe(filePath);
                filePath.on('finish', async () => {
                    count++
                    if (count === urls.length) {

                        try {
                            await AdmZipHelper.createZip(this.zip_path, this.pdfs_path, id)
                            await StatusControllers.changeStatus(id, 'completed', 'Label generation completed', `${this.zip_url}labels/status/${id}` );
                            this.Remove(filesnames)

                        } catch (error) {
                            StatusControllers.changeStatus(id, 'error', 'Something went wrong during the label generation');
                        }
                    }

                });
            })
        }

    }

    // Elimina los PDF descargados luego de comprimirlos
    Remove(filesnames) {
        /* Obtiene la ubicacion del archivo y lo borra */
        filesnames.forEach(filename => {
            try {
                fs.unlinkSync(this.pdfs_path + filename + '.pdf')
            } catch (error) {
                console.log(`[-] Ocurrio un error: ${error}`);
            }
        });

    }

    // seleciona el carrier a utilizar
    callCarrier(carrier, shipment_data) {
        /* Hay un objeto con el nombre del carrier y su respectiva funcion */
        const carries = {
            "fake_carrier": Carries.FakeCarrier(shipment_data)
            /* "otro_carrier" : Carries.OtroCarrier(shipment_data[i]) */
        }
        return carries[carrier] // retorna la funcion
    }

    // Realiza las consultas a la API deseada y retorna los resultados
    async Requests(shipments_data, id) {
        let results = [], i = 0;

        /* Recorre los datos del body, 
        obtiene los carries de cada uno y 
        efectua las consultas */

        for (i; i < shipments_data.length;) {
            const carrier = shipments_data[i].carrier;
            try {
                const data = await this.callCarrier(carrier, shipments_data[i])
                if (data.errors) {
                    i = shipments_data.length;
                    results = []
                } else {
                    results.push(data);
                    i++;
                }
            } catch (error) {
                StatusControllers.changeStatus(id, 'error', 'Something went wrong during the label generation');
                console.log(`[-] Ocurrio un error: ${error}`);
                i = shipments_data.length;
                results = []
            }
        }
        return results;
    }
}

module.exports = new LabelController()