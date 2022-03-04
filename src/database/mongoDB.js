const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/SkydropxChallenge')  

const connection = mongoose.connection;
connection.once ('open',()=>{
    console.log('[+] Base de datos MongoDB conectada');
});