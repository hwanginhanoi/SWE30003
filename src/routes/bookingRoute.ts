import * as express from 'express';
import ParkingSlot from '../models/ParkingSlot';
import JSONResponse from '../models/JSONResponse';
import authenticate from '../middleware/auth';
import SlotManager from "../models/SlotManager";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking";
import customer from "../models/Customer";
import booking from "../models/Booking";

const router = express.Router();


router.post('/create/', async (req, res) => {
    const {customerId, slotId, startTime, endTime, totalPrice, status} = req.body;
    const booking: Booking = new Booking(customerId, slotId, startTime, endTime, totalPrice, status)
    const result = await Booking.insertBooking(booking)


    if (result === false) {
        JSONResponse.serverError(req, res, 'Error create booking', null);
        return;
    } else {
        // const token = jwt.sign({ email: user.email }, 'secretKey123cutephomaique', {
        //     expiresIn: '1h',
        // });
        // const credentials = user.getJsonObject()
        JSONResponse.success(req, res, 'Booking created', {});
    }
});

router.delete('/delete/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        JSONResponse.serverError(req, res, 'Parking slot ID is required', null);
        return;
    }

    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
        JSONResponse.serverError(req, res, 'Invalid booking ID', null);
        return;
    }

    const booking = await Booking.getBookingByUId(bookingId)
    if (booking instanceof Booking) {
        const result = await Booking.deleteBooking(booking)
        if (result === false) {
            JSONResponse.serverError(req, res, 'Error delete booking', null);
            return;
        } else {
            // const token = jwt.sign({ email: user.email }, 'secretKey123cutephomaique', {
            //     expiresIn: '1h',
            // });
            // const credentials = user.getJsonObject()
            JSONResponse.success(req, res, 'Booking deleted', {});
        }
    } else {
        JSONResponse.serverError(req, res, 'Invalid booking ID', null);
    }
});

router.get('/update/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        JSONResponse.serverError(req, res, 'Booking ID is required', null);
        return;
    }

    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
        JSONResponse.serverError(req, res, 'Invalid booking ID', null);
        return;
    }
    const booking = await Booking.getBookingById(bookingId)
    if (booking instanceof Booking) {
        const result = await Booking.updateBooking(booking)
        if (result === false) {
            JSONResponse.serverError(req, res, 'Error update booking', null);
            return;
        } else {
            // const token = jwt.sign({ email: user.email }, 'secretKey123cutephomaique', {
            //     expiresIn: '1h',
            // });
            // const credentials = user.getJsonObject()
            JSONResponse.success(req, res, 'Booking updated', {});
        }
    } else {
        JSONResponse.serverError(req, res, 'Error update booking version 2', null);
    }
});

router.get('/getByUId/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        JSONResponse.serverError(req, res, 'User ID is required', null);
        return;
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
        JSONResponse.serverError(req, res, 'User booking ID', null);
        return;
    }
    const books = await Booking.getBookingByUId(userId)
    if (books) {
        JSONResponse.success(req, res, 'Booking list:', books);
    } else {
        JSONResponse.serverError(req, res, 'Error update booking version 2', null);
    }
});

router.get('/getById/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        JSONResponse.serverError(req, res, 'User ID is required', null);
        return;
    }

    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
        JSONResponse.serverError(req, res, 'User booking ID', null);
        return;
    }
    const books = await Booking.getBookingById(bookingId)
    if (books) {
        JSONResponse.success(req, res, 'Booking list:', books);
    } else {
        JSONResponse.serverError(req, res, 'Error update booking version 2', null);
    }
});
export default router;