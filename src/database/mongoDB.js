const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE)  


const connection = mongoose.connection;
connection.once ('open',()=>{
    console.log('[+] Base de datos MongoDB conectada');
});