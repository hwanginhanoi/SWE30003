import Account from './Account';
import ParkingSlot from './ParkingSlot';
import { SlotStatus, SlotType, Role } from "@prisma/client";

class Admin extends Account {
    constructor(name: string, email: string, password: string) {
        super(name, email, password, Role.Admin);
    }

    async createParkingSlot(type: SlotType, status: SlotStatus) {
        try {
            const newSlot = new ParkingSlot(type, status);
            await newSlot.save();
            return {
                success: true,
                message: 'Parking slot created successfully',
                data: newSlot,
            };
        } catch (error) {
            console.error('Error creating parking slot:', error);
        }
    }
}

export default Admin;