const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path')

// DataBase
require('./database/mongoDB')

class Server {
    constructor() {
        this.app = express();
    }
    Middlewares() {
        this.app.set('port', 6000);
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cookieParser());
    }
    Dotenv() {
        if (process.env.NODE_ENV !== 'production') {
            require('dotenv').config();
        }
    }
    Routes() {
        this.app.use('/labels', require('./routes/labels'));
        this.app.use(express.static(path.join(__dirname, 'public')))
    }
    Start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('[+] Servidor en linea en http://localhost:' + this.app.get('port'));
        })
    }
    get init() {
        this.Middlewares();
        this.Dotenv();
        this.Routes();
        this.Start();
    }
}

const server = new Server();
server.init;

