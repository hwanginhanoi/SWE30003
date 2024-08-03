import { PrismaClient } from '@prisma/client';
import { SlotType, SlotStatus } from '@prisma/client';


class ParkingSlot {
    public id: number;
    public type: SlotType;
    public status: SlotStatus;

    constructor(type: SlotType, status: SlotStatus) {
        this.type = type;
        this.status = status;
    }
}

export default ParkingSlot;