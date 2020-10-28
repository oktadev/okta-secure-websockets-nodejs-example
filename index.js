'use strict'

require('dotenv').config();

const server = require('./server')

const port = process.env.APP_BASE_PORT;

server.start({
    port: port
}).then(app => {
    console.log('Application is now running on port ' + port);
})