class Validations {
    static isNull(data) {
        for (let i in data) {
            if (!data[i].carrier || data[i].carrier === '' || data[i].carrier === null || !data[i].shipment ||data[i].shipment === {}) {
                return []
            }
        }
        return data
    } r
}

module.exports = Validations