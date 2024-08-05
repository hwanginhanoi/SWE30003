import request from 'supertest';
import App from '../../App';
import ParkingSlot from "../../models/ParkingSlot";
import SlotManager from "../../models/SlotManager";

jest.mock("../../models/SlotManager");

describe('Create Parking Slot', () => {
    it('should respond with success message when parking slot is created', async () => {
        (SlotManager.upsertParkingSlot as jest.Mock).mockResolvedValue(true);

        const response = await request(App)
            .post('/parkingslot/create/')
            .send({
                type: "Car",
                status: "Available"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Parking slot created');
    });

    it('should respond with an error message when parking slot creation fails', async () => {
        (SlotManager.upsertParkingSlot as jest.Mock).mockResolvedValue(false);

        const response = await request(App)
            .post('/parkingslot/create/')
            .send({
                type: "Car",
                status: ""
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error create parking slot');
    });
});

