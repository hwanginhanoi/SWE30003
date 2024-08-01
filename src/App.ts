import express from 'express';
import router from './routes/index'
import * as bodyParser from 'body-parser';
class App {
    public express
    constructor() {
        this.express = express()
        this.express.use(bodyParser.json())
        this.loadRoutes()
    }

    private loadRoutes(): void {
        this.express.use('/', router);
    }
}

export default new App().express;