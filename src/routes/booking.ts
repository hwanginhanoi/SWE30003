import * as express from 'express';
import ParkingSlot from '../models/ParkingSlot';
import JSONResponse from '../models/JSONResponse';
import authenticate from '../middleware/auth';
import slotManager from "../models/SlotManager";
import SlotManager from "../models/SlotManager";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post('/create/', async (req, res) => {
    const {type, status} = req.body;
    const parkingSlot: ParkingSlot = new ParkingSlot(type, status)
    const result = await SlotManager.upsertParkingSlot(parkingSlot)


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

router.get('/delete/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        JSONResponse.serverError(req, res, 'Parking slot ID is required', null);
        return;
    }

    const slotId = parseInt(id, 10);
    if (isNaN(slotId)) {
        JSONResponse.serverError(req, res, 'Invalid parking slot ID', null);
        return;
    }

    const slot = await SlotManager.getSlotById(slotId)
    if (slot instanceof ParkingSlot) {
        const result = await SlotManager.deleteParkingSlot(slot);
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
        JSONResponse.serverError(req, res, 'Invalid parking slot ID', null);
    }
});

router.get('/update/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        JSONResponse.serverError(req, res, 'Parking slot ID is required', null);
        return;
    }

    const slotId = parseInt(id, 10);
    if (isNaN(slotId)) {
        JSONResponse.serverError(req, res, 'Invalid parking slot ID', null);
        return;
    }
    const slot = await SlotManager.getSlotById(slotId)
    if (slot instanceof ParkingSlot) {
        const result = await SlotManager.upsertParkingSlot(slot)
        if (result === false) {
            JSONResponse.serverError(req, res, 'Error update booking', null);
            return;
        } else {
            // const token = jwt.sign({ email: user.email }, 'secretKey123cutephomaique', {
            //     expiresIn: '1h',
            // });
            // const credentials = user.getJsonObject()
            JSONResponse.success(req, res, 'Booking deleted', {});
        }
    } else {
        JSONResponse.serverError(req, res, 'Error update booking version 2', null);
    }
});

export default router;