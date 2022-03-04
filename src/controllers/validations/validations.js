class Validations {
    static isNull(data) {
        for (let i in data) {
            if (!data[i].carrier || data[i].carrier === '' || data[i].carrier === null || !data[i].shipment ||data[i].shipment === {}) {
                return []
            }
        }
        return data
    }
    static async Exists(model,_id){
        let data
        try{
            data = await model.findOne({_id})
        }catch{
            data = null
        }finally{
            if(data) return true
            return false
        }

    }
}

module.exports = Validations