const express = require('express'), morgan = require('morgan'), cookieParser = require('cookie-parser');
const path = require('path');

class Server {
    constructor() {
        this.app = express();

    }
    Middlewares() {
        this.app.set('port',process.env.PORT);
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cookieParser());
        require('./database/mongoDB')
    }
    Dotenv() {
        if (process.env.NODE_ENV !== 'production') {
            require('dotenv').config();
        }
    }
    Routes() {
        this.app.use('/labels', require('./routes/labels'));
        this.app.use('/clients', require('./routes/clients'));
        // this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use(express.static(path.join(__dirname.split('/src')[0],'doc')));
    }
    Start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('[+] Servidor en linea');
        })
    }
    get init() {
        this.Dotenv();
        this.Middlewares();
        this.Routes();
        this.Start();
    }
}

const server = new Server();
server.init;

module.exports=server

