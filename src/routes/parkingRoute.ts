import * as express from 'express';
import ParkingSlot from '../models/ParkingSlot';
import JSONResponse from '../models/JSONResponse';
import authenticate from '../middleware/auth';
import slotManager from "../models/SlotManager";
import SlotManager from "../models/SlotManager";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/read/all', authenticate, async (req, res) => {
    try {
        const slots = await SlotManager.getAllSlot();
        if (slots instanceof Error) {
            JSONResponse.serverError(req, res, slots.message, null);
        } else {
            JSONResponse.success(req, res, 'Parking slots fetched successfully', slots);
        }
    } catch (error) {
        JSONResponse.serverError(req, res, 'An unexpected error occurred', null);
    }
});

router.get('/read/:id', async (req, res) => {
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

    const slot = await SlotManager.getSlotById(slotId);
    if (slot instanceof Error) {
        JSONResponse.serverError(req, res, slot.message, null);
    } else {
        JSONResponse.success(req, res, 'Parking slot found', slot);
    }
});

router.post('/create', async (req, res) => {
    const {type, status} = req.body;
    const parkingSlot: ParkingSlot = new ParkingSlot(type, status)
    const result = await SlotManager.upsertParkingSlot(parkingSlot)

    if (!result) {
        JSONResponse.serverError(req, res, 'Error create parking slot', null);
        return;
    } else {
        // const token = jwt.sign({ email: user.email }, 'secretKey123cutephomaique', {
        //     expiresIn: '1h',
        // });
        // const credentials = user.getJsonObject()
        JSONResponse.success(req, res, 'Parking slot created', {});
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
        if (!result) {
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
        if (!result) {
            JSONResponse.serverError(req, res, 'Error update booking', null);
            return;
        } else {
            // const token = jwt.sign({ email: user.email }, 'secretKey123cutephomaique', {
            //     expiresIn: '1h',
            // });
            // const credentials = user.getJsonObject()
            JSONResponse.success(req, res, 'Parking slot deleted', {});
        }
    } else {
        JSONResponse.serverError(req, res, 'Error update parking slot version 2', null);
    }
});

export default router;