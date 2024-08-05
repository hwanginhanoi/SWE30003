import request from 'supertest';
import app from '../app';
import { Booking } from '../models/Booking';

jest.mock('../models/Booking');

describe('POST /create/', () => {
    it('should respond with success message when booking is created', async () => {
        (Booking.insertBooking as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .post('/create/')
            .send({
                customerId: 1,
                slotId: 2,
                startTime: '2023-08-01T10:00:00Z',
                endTime: '2023-08-01T12:00:00Z',
                totalPrice: 100,
                status: 'confirmed'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Booking created');
    });

    it('should respond with an error message when booking creation fails', async () => {
        (Booking.insertBooking as jest.Mock).mockResolvedValue(false);

        const response = await request(app)
            .post('/create/')
            .send({
                customerId: 1,
                slotId: 2,
                startTime: '2023-08-01T10:00:00Z',
                endTime: '2023-08-01T12:00:00Z',
                totalPrice: 100,
                status: 'confirmed'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error create booking');
    });
});
