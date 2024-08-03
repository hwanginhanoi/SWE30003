import {PrismaClient} from '@prisma/client';
import {SlotType, SlotStatus} from '@prisma/client';

class ParkingSlot {
    public id: number | null;
    public type: SlotType;
    public status: SlotStatus;

    constructor(type: SlotType, status: SlotStatus, id?: number) {
        this.type = type;
        this.status = status;
        this.id = id || null;
    }
}

export default ParkingSlot;