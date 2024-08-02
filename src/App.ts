import express from 'express';
import * as bodyParser from 'body-parser';
import userRouter from './routes/user'

class App {
    public express

    constructor() {
        this.express = express()
        this.express.use(bodyParser.json())
        this.loadRoutes()
    }

    private loadRoutes(): void {
        this.express.use('/user', userRouter);
    }

}

export default new App().express;