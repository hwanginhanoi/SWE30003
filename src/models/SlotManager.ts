import {PrismaClient, SlotStatus, SlotType} from "@prisma/client";
import ParkingSlot from "./ParkingSlot";

const prisma = new PrismaClient();

class SlotManager {
    private static instance: SlotManager;

    private constructor() {
    }

    public static getInstance(): SlotManager {
        if (!SlotManager.instance) {
            SlotManager.instance = new SlotManager();
        }
        return SlotManager.instance;
    }

    static async getAllSlot(): Promise<ParkingSlot[] | Error> {
        try {
            const slots = await prisma.parkingSlot.findMany();
            return slots.map(slot => new ParkingSlot(slot.type, slot.status));
        } catch (error) {
            console.error('Error fetching parking slots:', error);
            return Error('Failed to fetch parking slots');
        }
    }

    static async getSlotById(id: number): Promise<ParkingSlot | Error> {
        try {
            const slot = await prisma.parkingSlot.findUnique({
                where: {id: id},
            });
            if (!slot) {
                return Error("Slot not found");
            }
            else
            {
                return new ParkingSlot(slot.type, slot.status, slot.id);
            }


        } catch (error) {
            console.error("Error fetching parking slot:", error);
            return Error("Slot not found");
        }
    }

    static async upsertParkingSlot(parkingSlot: ParkingSlot): Promise<boolean> {
        try {
            const result = await prisma.parkingSlot.upsert({
                where: {
                    id: parkingSlot.id || 0
                },
                update: {
                    type: parkingSlot.type,
                    status: parkingSlot.status,
                },
                create: {
                    type: parkingSlot.type,
                    status: parkingSlot.status,
                },
            });
            return true;
        } catch (error) {
            console.error('Error saving parking slot:', error);
            return false;
        }
    }

    static async deleteParkingSlot(parkingSlot: ParkingSlot): Promise<boolean> {
        try {
            const result = await prisma.parkingSlot.delete({
                where: {
                    id: parkingSlot.id || 0,
                },
            });
            return true;
        } catch (error) {
            console.error('Error delete parking slot:', error);
            return false;
        }
    }


    // Add more methods for managing slots if needed
}

export default SlotManager;
