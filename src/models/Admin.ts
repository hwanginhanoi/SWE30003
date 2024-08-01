import Account from './Account';
import { Role, SlotStatus, SlotType } from "@prisma/client";
import SlotManager from './SlotManager';

class Admin extends Account {
    constructor(name: string, email: string, password: string) {
        super(name, email, password, Role.Admin);
    }

    async createParkingSlot(type: SlotType, status: SlotStatus): Promise<void> {
        try {
            const slotManager = SlotManager.getInstance();
            const slotId = await slotManager.addParkingSlot(type, status);
            console.log(`Parking slot created with ID: ${slotId}`);
        } catch (error) {
            console.error('Error creating parking slot:', error);
        }
    }

}

export default Admin;