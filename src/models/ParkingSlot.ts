import { PrismaClient } from '@prisma/client';
import { SlotType, SlotStatus } from '@prisma/client';

const prisma = new PrismaClient();

class ParkingSlot {
    public id?: number;
    public type: SlotType;
    public status: SlotStatus;

    constructor(type: SlotType, status: SlotStatus, id?: number) {
        this.type = type;
        this.status = status;
        this.id = id;
    }

    async save(): Promise<void> {
        try {
            const result = await prisma.parkingSlot.create({
                data: {
                    type: this.type,
                    status: this.status,
                },
            });
            this.id = result.id;
        } catch (error) {
            console.error('Error saving parking slot:', error);
        }
    }
}

export default ParkingSlot;