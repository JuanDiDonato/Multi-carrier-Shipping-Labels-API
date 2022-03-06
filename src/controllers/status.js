/* Controlador para verificar el estado de la etiqueta */

const Status = require('../models/status');
const Validations = require('./validations/validations');
const AdmZipHelper = require('../helpers/admZip');
const fs = require('fs');
const pdfParse = require("pdf-parse");
const {pipeline} = require('stream')


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

    // retorna los datos del zip.
    async getZipData(req, res) {
        const { _id } = req.params;
        if (Validations.notNull({ _id })) {
            //const pdfParser = new PDFParser();

            const zip_path = `/home/juan/Documentos/Skydropx-Challenge/src/public/zip/${_id}.zip`;
            const outpath = `/home/juan/Documentos/Skydropx-Challenge/src/public/`;
            //var file = fs.createReadStream(zip_path);
            var file = AdmZipHelper.Read(zip_path)
            console.log(file[0].toString());
            res.status(200).send(file[0].toJSON()
            )

            //AdmZipHelper.extractArchive(zip_path, outpath, _id).then(() => {
                
                
                //let pdfs = ['7481.pdf','7482.pdf','7483.pdf']
                //pdfs.forEach(element => {
                    //var file = fs.createReadStream(`${outpath}${_id}/${element}`);
                    //res.setHeader('Content-Type', 'application/pdf');
                    //res.setHeader('Content-Disposition', 'attachment; filename='+element);
                    //file.pipe(res);
                //});
                
                //const pdf_file = fs.readFileSync(`${outpath}${_id}/7481.pdf`)

                //pdfParse(pdf_file).then(data => {
                //console.log(data);
                //return HttpResponse(bytes(data), content_type='application/pdf')
                //})
                // PDFParser

                /*
                pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
                pdfParser.on("pdfParser_dataReady", pdfData => {
                    console.log(pdfData.Pages[0].Texts);
                    fs.writeFile("test.json", JSON.stringify(pdfData.Pages[0].Texts), (data) => {
                        console.log(data);
                    });
                });
                pdfParser.loadPDF(`${outpath}${_id}/7481.pdf`);
                */
            //})
        }
    }

    // crea una nueva instancia para un zip.
    async Status() {
        const newStatus = new Status();
        await newStatus.save();
        return newStatus._id.toString()
    }

    // modifica la instancia de un zip.
    async changeStatus(_id, label_status, label_status_description, url) {
        await Status.findOneAndUpdate({ _id }, { label_status, label_status_description, url })
    }


}

module.exports = new StatusControllers()

