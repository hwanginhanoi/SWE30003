import * as express from 'express';
import ParkingSlot from '../models/ParkingSlot';
import JSONResponse from '../models/JSONResponse';
import authenticate from '../middleware/auth';
import SlotManager from "../models/SlotManager";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking";
import customer from "../models/Customer";
import booking from "../models/Booking";
import Receipt from "../models/Receipt";
import receipt from "../models/Receipt";

const router = express.Router();


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
    const receipts = await Receipt.getReceiptsByUserId(userId)
    if (receipts) {
        JSONResponse.success(req, res, 'Booking list:', receipts);
    } else {
        JSONResponse.serverError(req, res, 'Error update booking version 2', null);
    }
});


export default router;