import {SlotStatus, SlotType} from "@prisma/client";
import ParkingSlot from "./ParkingSlot";

class SlotManager {
    private static instance: SlotManager;
    private name:string = "SlotManager";

    private constructor() { }

    public static getInstance(): SlotManager {
        if (!SlotManager.instance) {
            SlotManager.instance = new SlotManager();
        }
        return SlotManager.instance;
    }

    async addParkingSlot(type: SlotType, status: SlotStatus): Promise<boolean> {
        const slot = new ParkingSlot(type, status);
        return await slot.save(); // Handle success/failure based on the return value
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
    // Add more methods for managing slots if needed
}

export default SlotManager;