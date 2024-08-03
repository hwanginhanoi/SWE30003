import User from './User';
import {Role, SlotStatus, SlotType} from "@prisma/client";
import SlotManager from './SlotManager';
import ParkingSlot from "./ParkingSlot";

class Admin extends User {
    constructor(name: string, email: string, password: string) {
        super(name, email, password, Role.Admin);
    }

    async createParkingSlot(type: SlotType, status: SlotStatus): Promise<void> {
        try {
            const slotManager = SlotManager.getInstance();
            const parkingSlot: ParkingSlot = new ParkingSlot(type, status)
            const slotId = await SlotManager.upsertParkingSlot(parkingSlot);
            console.log(`Parking slot created with ID: ${slotId}`);
        } catch (error) {
            console.error('Error creating parking slot:', error);
        }
    }


}

export default Admin;