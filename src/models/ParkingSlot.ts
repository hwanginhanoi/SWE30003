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

    async save(): Promise<boolean> {
        try {
            const result = await prisma.parkingSlot.create({
                data: {
                    type: this.type,
                    status: this.status,
                },
            });
            this.id = result.id;
            return true;
        } catch (error) {
            console.error('Error saving parking slot:', error);
            return false;
        }
    }

     static async getAll(): Promise<ParkingSlot[] | Error> {
        try {
            const slots = await prisma.parkingSlot.findMany();
            return slots.map(slot => new ParkingSlot(slot.type, slot.status, slot.id));
        } catch (error) {
            console.error('Error fetching parking slots:', error);
            return Error('Failed to fetch parking slots');
        }
    }

     static async getById(id: number): Promise<ParkingSlot | Error> {
        try {
            const slot = await prisma.parkingSlot.findUnique({ where: { id } });
            if (slot) {
                return new ParkingSlot(slot.type, slot.status, slot.id);
            } else {
                return new Error('Parking slot not found');
            }
        } catch (error) {
            console.error('Error fetching parking slot:', error);
            return new Error('Failed to fetch parking slot');
        }
    }
}

export default ParkingSlot;