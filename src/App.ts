import express from 'express';
import * as bodyParser from 'body-parser';
import userRouter from './routes/userRoute'
import parkingSlot from "./routes/parkingRoute";
import bookingRouter from './routes/bookingRoute';

class App {
    public express

    constructor() {
        this.express = express()
        this.express.use(bodyParser.json())
        this.loadRoutes()
    }


    private loadRoutes(): void {
        this.express.use('/user', userRouter);
        this.express.use('/parkingslot', parkingSlot)
        this.express.use('/booking', bookingRouter);
    }

}

export default new App().express;