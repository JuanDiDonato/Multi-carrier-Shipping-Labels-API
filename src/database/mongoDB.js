const mongoose = require('mongoose');

/* Conexion a la base de datos MongoDB */

mongoose.connect(process.env.DATABASE)  

const connection = mongoose.connection;
connection.once ('open',()=>{
    console.log('[+] Base de datos MongoDB conectada');
});