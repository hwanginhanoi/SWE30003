import request from 'supertest';
import App from '../../App'; // Adjust the path as necessary
import PaymentService from '../../models/PaymentService';
import Receipt from '../../models/Receipt';
import PushNotification from '../../notifications/PushNotification';
import EmailNotification from '../../notifications/EmailNotification';
import SMSNotification from '../../notifications/SMSNotification';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

jest.mock('../../models/PaymentService');
jest.mock('../../models/Receipt');
jest.mock('../../notifications/PushNotification');
jest.mock('../../notifications/EmailNotification');
jest.mock('../../notifications/SMSNotification');

describe('POST /process', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should process payment successfully', async () => {
        const processPaymentMock = jest.fn().mockResolvedValue(true);
        const getReceiptsByInvoiceIdMock = jest.fn().mockResolvedValue(new Receipt(
            1,
            2,
            PaymentMethod.CreditCard,
            PaymentStatus.Pending,
            100,
            new Date()
        ));

        PaymentService.getInstance = jest.fn().mockReturnValue({
            processPayment: processPaymentMock
        });
        Receipt.getReceiptsByInvoiceId = getReceiptsByInvoiceIdMock;

        const response = await request(App)
            .post('/payment/process')
            .send({
                invoiceId: 'invoice123',
                amount: 100,
                method: PaymentMethod.CreditCard
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Payment success');
    });

    it('should process payment with email and SMS notifications', async () => {
        const processPaymentMock = jest.fn().mockResolvedValue(true);
        const getReceiptsByInvoiceIdMock = jest.fn().mockResolvedValue(new Receipt(
            1,
            2,
            PaymentMethod.CreditCard,
            PaymentStatus.Pending,
            100,
            new Date()
        ));
        const attachMock = jest.fn();
        const notifyAllObserversMock = jest.fn().mockReturnValue({
            push: 'Push notification sent',
            email: 'Email notification sent',
            sms: 'SMS notification sent'
        });

        PaymentService.getInstance = jest.fn().mockReturnValue({
            processPayment: processPaymentMock
        });
        Receipt.getReceiptsByInvoiceId = getReceiptsByInvoiceIdMock;

        (Receipt as jest.MockedClass<typeof Receipt>).mockImplementation(() => {
            return {
                attach: attachMock,
                notifyAllObservers: notifyAllObserversMock
            } as unknown as Receipt;
        });

        const response = await request(App)
            .post('/payment/process')
            .send({
                invoiceId: 'invoice123',
                amount: 100,
                method: PaymentMethod.CreditCard,
                email: true,
                sms: true
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Payment success');
        expect(notifyAllObserversMock).toHaveBeenCalledWith('Your payment successfully. ');
        expect(attachMock).toHaveBeenCalledTimes(3); // Push, Email, and SMS notifications
    });
});