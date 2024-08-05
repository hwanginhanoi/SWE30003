import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/userRoute'
import parkingSlot from "./routes/parkingRoute";
import bookingRouter from './routes/bookingRoute';
import paymentRouter from './routes/paymentRoute';
import invoiceRouter from './routes/invoiceRoute';
import receiptRoute from "./routes/receiptRoute";
import statistic from "./models/Statistic";
import statisticRoute from "./routes/statisticRoute";


class App {
    public express

    constructor() {
        this.express = express()
        this.express.use(bodyParser.json())
        this.express.use(cors());
        this.loadRoutes()

        console.log('App started')
    }

    private loadRoutes(): void {
        this.express.use('/user', userRouter);
        this.express.use('/parkingslot', parkingSlot)
        this.express.use('/booking', bookingRouter);
        this.express.use('/payment', paymentRouter);
        this.express.use('/receipt', receiptRoute);
        this.express.use('/invoice', invoiceRouter);
        this.express.use('/statistic', statisticRoute);
    }

}

export default new App().express;