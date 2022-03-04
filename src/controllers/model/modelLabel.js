const axios = require('axios')
const https = require('https')
const fs = require("fs")
const fsp = require("fs").promises
const AdmZip = require("adm-zip");

// validaciones
const Validations = require('../validations/validations');
const res = require('express/lib/response');

class LabelModel {
    constructor(api, model) {
        this.model = model
        this.api = api
        this.path = `/home/juan/Documentos/Skydropx-Challenge/src/public/pdfs/`;
    }

    async Shipments(req, res) {
        const shipments = req.body;
        let ids = []
        const shipment_data = Validations.isNull(shipments);
        if (shipment_data && shipment_data.length === 0) res.status(400).json({ erro: true, message: 'Ocurrio un error.' });
        else {
            this.Requests(shipment_data).then((results) => {
                // valido si ya existe un archivo .zip
                results.forEach(element => {
                    ids.push(element.id)
                    this.Status(element.id)
                });

                this.Download(results)
                res.status(200).json({ error: false, message: 'Etiquetas solicitadas con exito.', labels: ids })
            })

        }

    }

    async Status(shipment_id) {
        const NewStatus = new this.model({ shipment_id })
        await NewStatus.save()
    }

    async changeStatus(shipment_id, label_status, label_status_description) {
        await this.model.findOneAndUpdate({ shipment_id }, { label_status, label_status_description })
    }

    async Download(urls) {
        // Descarga los PDFs desde el link que devuelve la API
        let filesPaths = []

        for (let i in urls) {
            await this.changeStatus(urls[i].id, 'processing', 'Processing label generation')
            this.Zip(urls[i].id).then(
                await https.get(urls[i].url, (res) => {
                    let filename = urls[i].id, filepath = this.path + filename + '.pdf';
                    filesPaths.push({ name: filename, path: filepath })
                    const filePath = fs.createWriteStream(filepath);
                    res.pipe(filePath);
                    filePath.on('finish', () => {
                        let zippath = `/home/juan/Documentos/Skydropx-Challenge/src/public/zip/${urls[i].id}.zip`
                        this.UpdateZip(zippath, filepath, filename)
                    });
                })
            )

        }
    }

    async Zip(filename) {
        // Este metodo se encarga de crear el zip.
        try {
            const zip = new AdmZip();
            const outputFile = `/home/juan/Documentos/Skydropx-Challenge/src/public/zip/${filename}.zip`;
            zip.addLocalFolder(this.path);
            zip.writeZip(outputFile);
        } catch (error) {
            console.log(`[-] Ocurrio un error: ${error}`);
        }

    }
    async UpdateZip(zipPath, filepath, filename) {
        // Agrega el PDF al zip creado, y luego borra el PDF descargado.
        try {
            const zip = new AdmZip(zipPath);
            let content = await fsp.readFile(filepath);
            zip.addFile(filename + '.pdf', content);
            zip.writeZip(zipPath);
            await this.changeStatus(filename, 'completed', 'Label generation completed')

        } catch (e) {
            console.log(`[-] Ocurrio un error: ${error}`);
        } finally {
            this.Remove(filepath)
        }
    }

    /*
        Read(filepath) {
        // Recibe el path de un zip, y muestra el contenido del mismo.
        try {
            const zip = new AdmZip(filepath);
            const entries = zip.getEntries()
            return entries
        } catch (error) {
            return []
        }
    }
    
    */


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
            }
        } catch (error) {
            console.log(error);
        } finally {

            return results
        }
    }
}

module.exports = LabelModel