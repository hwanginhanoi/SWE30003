import express, { Request, Response } from 'express';
import PaymentService from '../models/PaymentService';
import { PaymentMethod } from '@prisma/client';
import JSONResponse from "../models/JSONResponse";

const router = express.Router();
const paymentService = PaymentService.getInstance();

router.post('/process', async (req: Request, res: Response) => {
    const { invoiceId, amount, method } = req.body;

    if (!invoiceId) {
        JSONResponse.serverError(req, res, 'Missing required fields', null);
    }

    try {
        await paymentService.processPayment(invoiceId, amount, method as PaymentMethod);
        JSONResponse.success(req, res, 'Payment processed', null);
    } catch (error) {
        console.error('Error processing payment:', error);
        JSONResponse.serverError(req, res, 'Failed to process payment', null);
    }
});

export default router;