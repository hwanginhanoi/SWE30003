import { Router, Request, Response } from 'express';
import Customer from '../models/Customer'; // Adjust the path as needed
import JSONResponse from '../models/JSONResponse';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
    try {
        const { id, slotId, startTime, endTime, totalPrice } = req.body;

        if (!id || !slotId || !startTime || !endTime || !totalPrice) {
            JSONResponse.serverError(req, res, 'Missing required fields', null);
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        const customer = await Customer.findCustomerById(id);
        if (!customer) {
            JSONResponse.serverError(req, res, 'Customer not found', null);
            return;
        }

        const booking = await customer.createBooking(slotId, start, end, totalPrice);

        if (booking) {
            JSONResponse.success(req, res, 'Booking created successfully', booking);
        }
        else {
            JSONResponse.serverError(req, res, 'Failed to create booking', null);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message, error.stack);
            JSONResponse.serverError(req, res, error.message, null);
        } else {
            console.log('An unknown error occurred', error);
            JSONResponse.serverError(req, res, 'An unknown error occurred', null);
        }
    }
});

export default router;