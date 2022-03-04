const fsp = require("fs").promises;
const AdmZip = require("adm-zip");

class AdmZipHelper {

    // Crea el archivo .zip
    static async createZip(filename, path) {
        try {
            const zip = new AdmZip();
            const outputFile = `/home/juan/Documentos/Skydropx-Challenge/src/public/zip/${filename}.zip`;
            zip.addLocalFolder(path);
            zip.writeZip(outputFile);
        } catch (error) {
            console.log(`[-] Ocurrio un error: ${error}`);
        }

    }

    // Agrega el PDF al zip creado, y luego borra el PDF descargado.
    static async UpdateZip(zipPath, filepath, filename) {
        try {
            const zip = new AdmZip(zipPath);
            let content = await fsp.readFile(filepath);
            zip.addFile(filename + '.pdf', content);
            zip.writeZip(zipPath);
            //await this.changeStatus(filename, 'completed', 'Label generation completed')
        } catch (error) {
            console.log(`[-] Ocurrio un error: ${error}`);
        }
    }

    // Recibe el path de un zip, y muestra el contenido del mismo.
    static Read(filepath) {
        try {
            const zip = new AdmZip(filepath);
            const entries = zip.getEntries()
            return entries
        } catch (error) {
            return []
        }
    }


}

module.exports = AdmZipHelper