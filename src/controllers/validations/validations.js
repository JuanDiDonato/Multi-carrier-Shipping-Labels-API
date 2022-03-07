class Validations {

    // verifica que se hayan enviado datos de envio y del correo
    static isNull(data) {
        for (let i in data) {
            if (!data[i].carrier || data[i].carrier === '' || data[i].carrier === null || !data[i].shipment || data[i].shipment === {}) {
                return []
            }
        }
        return data
    }

    // valida que los datos obtenidos del body no sean nulos, ni que esten en blanco
    static notNull(data) {
        for (let i in data) {
            if (!data[i] || data[i] === null || data[i] === '') return false
        }
        return true
    }
    static async Exists(model, label_id, _id) {
        let data
        try {
            data = await model.findOne({ _id:label_id,client:_id })
        } catch {
            data = null
        } finally {
            return data
        }

    }
}

module.exports = Validations