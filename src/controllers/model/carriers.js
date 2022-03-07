const axios = require('axios');

/* 

Esta clase tine la logica de las consultas a cada API.
Cada API es un metodo, por lo que para agregar una nueva API solo
hay que crear un metodo para ella, y escribir la consulta.

Puesto que cada API es diferente, no todas devuelven la misma estructura de 
datos, por lo que cada una tiene su propio metodo para trabajar esos datos.

Cada metodo retorna una respuesta, o un error ( error que se produce si los datos del
body estan incorrectos, o si hay datos faltantes)

Si la API devuelve un estado de error por estas saturada, vuelve a intentar la peticion hasta 
que sea exitosa.

*/

class Carries {

    // Fake carrier API
    static async FakeCarrier(shipment_data) {
        // parametros para la consulta a FakeCarrier
        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token token=${process.env.TOKEN}`
            },
            validateStatus: false
        }
        let i = 0;
        // Consulta
        for(i;i<1;){
            const { data } = await axios.post(process.env.API_URL, shipment_data, params);
            if (data['data']) {
                i++;
                return { 'id': data.data.id, 'url': data.data.attributes.file_url };
            }
            else if (data['errors'] && data['errors'] !== []) {
                i++;
                return data;
            }
        }
    }
    
    /* Agregar mas APIS aqui */
}

module.exports = Carries