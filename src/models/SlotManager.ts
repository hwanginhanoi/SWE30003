import {PrismaClient, SlotStatus, SlotType} from "@prisma/client";
import ParkingSlot from "./ParkingSlot";

const prisma = new PrismaClient();
class SlotMan

    async deleteSlot()
    {

    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
    // Add more methods for managing slots if needed
}

export default Slot