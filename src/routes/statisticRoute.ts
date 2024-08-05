import * as express from 'express';
import ParkingSlot from '../models/ParkingSlot';
import JSONResponse from '../models/JSONResponse';
import authenticate from '../middleware/auth';
import SlotManager from "../models/SlotManager";
import jwt from "jsonwebtoken";
import Statistic from "../models/Statistic";
import Receipt from "../models/Receipt";
import Booking from "../models/Booking";
import {BookingStatus} from "@prisma/client";

const router = express.Router();

router.get('/totalBooking', async (req, res) => {

    const countBooking = Statistic.getTotalBookings()
    if (countBooking) {
        JSONResponse.success(req, res, "Total number booking", countBooking)
    } else {
        JSONResponse.serverError(req, res, "Cannot fetching API", null)
    }
});

router.get('/bookingByStatus/:status', async (req, res) => {

    const {status} = req.params

    const countBooking = Statistic.getBookingsByStatus(status as BookingStatus)
    if (countBooking) {
        JSONResponse.success(req, res, "Total number booking by status: ", countBooking)
    } else {
        JSONResponse.serverError(req, res, "Cannot fetching API", null)
    }
});

router.get('/slot', async (req, res) => {

    const stats = Statistic.getSlotStatistics()
    if (stats) {
        JSONResponse.success(req, res, "Slot statistic: ", stats)
    } else {
        JSONResponse.serverError(req, res, "Cannot fetching API", null)
    }
});

router.get('/payment', async (req, res) => {

    const stats = Statistic.getPaymentStatistics()
    if (stats) {
        JSONResponse.success(req, res, "Payment statistic: ", stats)
    } else {
        JSONResponse.serverError(req, res, "Cannot fetching API", null)
    }
});

router.get('/notification', async (req, res) => {

    const stats = Statistic.getNotificationStatistics()
    if (stats) {
        JSONResponse.success(req, res, "Notification statistic: ", stats)
    } else {
        JSONResponse.serverError(req, res, "Cannot fetching API", null)
    }
});
router.get('/revenue', async (req, res) => {

    const stats = Statistic.getPaymentStatistics()
    if (stats) {
        JSONResponse.success(req, res, "Revenue statistic: ", stats)
    } else {
        JSONResponse.serverError(req, res, "Cannot fetching API", null)
    }
});


export default router;