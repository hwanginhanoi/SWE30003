import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/userRoute';
import parkingSlot from './routes/parkingRoute';
import bookingRouter from './routes/bookingRoute';
import paymentRouter from './routes/paymentRoute';
import invoiceRouter from './routes/invoiceRoute';
import receiptRoute from './routes/receiptRoute';
import statistic from './models/Statistic';
import statisticRoute from './routes/statisticRoute';
import { PrismaClient, SlotType, SlotStatus } from '@prisma/client';

const prisma = new PrismaClient();

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.express.use(bodyParser.json());
        this.express.use(cors());
        this.loadRoutes();
        this.insertDummyDataIfEmpty();

        console.log('App started');
    }

    private loadRoutes(): void {
        this.express.use('/user', userRouter);
        this.express.use('/parkingslot', parkingSlot);
        this.express.use('/booking', bookingRouter);
        this.express.use('/payment', paymentRouter);
        this.express.use('/receipt', receiptRoute);
        this.express.use('/invoice', invoiceRouter);
        this.express.use('/statistic', statisticRoute);
    }

    private async insertDummyDataIfEmpty(): Promise<void> {
        try {
            const count = await prisma.parkingSlot.count();

            if (count === 0) {
                console.log('No parking slots found. Inserting dummy data...');

                await prisma.parkingSlot.createMany({
                    data: [
                        { type: SlotType.Car, status: SlotStatus.Available },
                        { type: SlotType.Car, status: SlotStatus.Available },
                        { type: SlotType.Car, status: SlotStatus.Available },
                        { type: SlotType.Motorbike, status: SlotStatus.Available },
                        { type: SlotType.Motorbike, status: SlotStatus.Available },
                        { type: SlotType.Motorbike, status: SlotStatus.Available },
                        { type: SlotType.Car, status: SlotStatus.Occupied },
                        { type: SlotType.Motorbike, status: SlotStatus.Reserved },
                        { type: SlotType.Motorbike, status: SlotStatus.Available },
                        { type: SlotType.Motorbike, status: SlotStatus.Occupied },
                    ],
                });

                console.log('Dummy data inserted successfully.');
            } else {
                console.log('Parking slots already exist. No dummy data inserted.');
            }
        } catch (error) {
            console.error('Error inserting dummy data:', error);
        } finally {
            await prisma.$disconnect();
        }
    }
}

export default new App().express;