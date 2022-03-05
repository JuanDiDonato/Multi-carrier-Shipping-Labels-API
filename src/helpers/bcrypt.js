const bcrypt = require('bcryptjs')
class Bcrypt{
    
    static async EncryptPassword(password){
        const salt = await bcrypt.genSalt(12)
        return bcrypt.hash(password,salt)
    }

    static async MatchPassword(password,userPassword){
        try {
            return await bcrypt.compare(password,userPassword)
        }catch(error) {
            console.log('[-] '+error);
        }
    }

}

module.exports = Bcrypt