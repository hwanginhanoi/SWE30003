import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

class Booking {
    public customerId: number;
    public slotId: number;
    public startTime: Date;
    public endTime: Date;
    public totalPrice: number;
    public status: BookingStatus;

    constructor(customerId: number, slotId: number, startTime: Date, endTime: Date, totalPrice: number, status: BookingStatus) {
        this.customerId = customerId;
        this.slotId = slotId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    async save(): Promise<void> {
        try {
            await prisma.booking.create({
                data: {
                    customerId: this.customerId,
                    slotId: this.slotId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    totalPrice: this.totalPrice,
                    status: this.status,
                },
            });
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    }
}

export default Booking;