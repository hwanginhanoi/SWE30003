import request from 'supertest';
import App from '../../App';
import Booking from "../../models/Booking";

jest.mock("../../models/Booking");

describe('Create Booking', () => {
    it('should respond with success message when booking is created', async () => {
        (Booking.insertBooking as jest.Mock).mockResolvedValue(true);

        const response = await request(App)
            .post('/booking/create/')
            .send({
                customerId: 1,
                slotId: 2,
                startTime: '2023-08-01T10:00:00Z',
                endTime: '2023-08-01T12:00:00Z',
                totalPrice: 100,
                status: 'Pending'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Booking created');
    });

    it('should respond with an error message when booking creation fails', async () => {
        (Booking.insertBooking as jest.Mock).mockResolvedValue(false);

        const response = await request(App)
            .post('/booking/create/')
            .send({
                customerId: 1,
                slotId: 2,
                startTime: '2023-08-01T10:00:00Z',
                endTime: '2023-08-01T12:00:00Z',
                totalPrice: 100,
                status: 'Pending'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error create booking');
    });
});
