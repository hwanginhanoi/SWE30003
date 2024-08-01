import express from 'express';
import * as bodyParser from 'body-parser';
import indexRouter from './routes/account'

class App {
    public express
    constructor() {
        this.express = express()
        this.express.use(bodyParser.json())
        this.loadRoutes()
    }

    private loadRoutes(): void {
        this.express.use('/', indexRouter);
    }
}

export default new App().express;