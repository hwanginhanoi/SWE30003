import express, {Request, Response} from 'express';
import PaymentService from '../models/PaymentService';
import {BookingStatus, PaymentMethod} from '@prisma/client';
import JSONResponse from "../models/JSONResponse";
import PushNotification from "../notifications/PushNotification";
import Booking from "../models/Booking";
import Receipt from "../models/Receipt";
import EmailNotification from "../notifications/EmailNotification";
import SMSNotification from "../notifications/SMSNotification";

const router = express.Router();
const paymentService = PaymentService.getInstance();

router.post('/process', async (req: Request, res: Response) => {
    const {invoiceId, amount, method, email, sms} = req.body;

    const message: string = `Your payment successfully. `
    const pushNotification = new PushNotification()
    const receipt = new Receipt.getReceiptsByInvoiceId(invoiceId)
    if (receipt instanceof Receipt) {
        receipt.attach(pushNotification);

        if (email) {
            const emailNotificationObserver = new EmailNotification()
            receipt.attach(emailNotificationObserver);
        }
        if (sms) {
            const smsNotificationObserver = new SMSNotification()
            receipt.attach(smsNotificationObserver);
        }
        const notificaion: { [key: string]: string } = receipt.notifyAllObservers(message)


        JSONResponse.success(req, res, 'Payment success', notificaion);

    }

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