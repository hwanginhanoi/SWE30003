import User from './User';
import { Role, SlotStatus, SlotType } from "@prisma/client";
import SlotManager from './SlotManager';

class Admin extends User {
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

    public setName(name: string): void {
        const slotManager = SlotManager.getInstance();
        slotManager.setName(name);
    }

    public getName(): string {
        const slotManager = SlotManager.getInstance();
        return slotManager.getName();
    }

}

export default Admin;