import * as express from 'express';
import ParkingSlot from '../models/ParkingSlot';
import JSONResponse from '../models/JSONResponse';
import authenticate from '../middleware/auth';

const router = express.Router();

router.get('/parkingSlot/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    if (!id) {
        JSONResponse.serverError(req, res, 'Parking slot ID is required', null);
        return;
    }

    const slotId = parseInt(id, 10);
    if (isNaN(slotId)) {
        JSONResponse.serverError(req, res, 'Invalid parking slot ID', null);
        return;
    }

    const slot = await ParkingSlot.getById(slotId);
    if (slot instanceof Error) {
        JSONResponse.serverError(req, res, slot.message, null);
    } else {
        JSONResponse.success(req, res, 'Parking slot found', slot);
    }
});

export default router;