import express from 'express';
import * as bodyParser from 'body-parser';
import userRouter from './routes/user'
import parkingSlot from "./routes/parkingSlot";
import bookingRouter from './routes/booking';
import paymentRouter from './routes/paymentRoute';

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
        this.express.use('/payment', paymentRouter);
    }

}

export default new App().express;