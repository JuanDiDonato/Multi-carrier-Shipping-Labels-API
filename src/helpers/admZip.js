const fsp = require("fs").promises;
const AdmZip = require("adm-zip");

class AdmZipHelper {

    // Crea el archivo .zip
    static async createZip(zippath,pdfspath,zipname) {
        try {
            const zip = new AdmZip();
            const outputFile = `${zippath}${zipname}.zip`;
            zip.addLocalFolder(pdfspath);
            zip.writeZip(outputFile);
        } catch (error) {
            console.log(`[-] Ocurrio un error: ${error}`);
        }
    }

    // Agrega el PDF al zip creado, y luego borra el PDF descargado.
    static async UpdateZip(zipPath, filepath, filesnames) {
        for (let file in filesnames) {
            try {
                const zip = new AdmZip(zipPath);
                let content = await fsp.readFile(filepath + filesnames[file] + '.pdf');
                zip.addFile(filesnames[file] + '.pdf', content);
                zip.writeZip(zipPath);
            } catch (error) {
                console.log(`[-] Ocurrio un error: ${error}`);
            }
        }
    }

    // Recibe el path de un zip, y muestra el contenido del mismo.
    static Read(filepath) {
        try {
            const zip = new AdmZip(filepath);
            const entries = zip.getEntries();
            return entries;
        } catch (error) {
            return [];
        }
    }
    // extrae el archivo zip
    static async extractArchive(filepath,outpath,id) {
        try {
          const zip = new AdmZip(filepath);
          const outputDir = `${outpath}${id}`;
          zip.extractAllTo(outputDir);
          console.log(`Extracted to "${outputDir}" successfully`);
        } catch (e) {
          console.log(`Something went wrong. ${e}`);
        }
      }


}

module.exports = AdmZipHelper