import {PrismaClient, BookingStatus, PaymentStatus} from '@prisma/client';
import Invoice from './Invoice'; // Ensure the path is correct

const prisma = new PrismaClient();

class Booking {
    public bookingId?: number;
    public customerId: number;
    public slotId: number;
    public startTime: Date;
    public endTime: Date;
    public totalPrice: number;
    public status: BookingStatus;

    constructor(customerId: number, slotId: number, startTime: Date, endTime: Date, totalPrice: number, status: BookingStatus, bookingId? : number) {
        this.customerId = customerId;
        this.slotId = slotId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalPrice = totalPrice;
        this.status = status;
        this.bookingId = bookingId
    }

    async save(): Promise<Invoice | null> {
        try {
            const slot = await prisma.parkingSlot.findUnique({
                where: { id: this.slotId },
            });

            if (!slot) {
                console.error('Slot not found');
                return null;
            }

            const booking = await prisma.booking.create({
                data: {
                    customerId: this.customerId,
                    slotId: this.slotId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    totalPrice: this.totalPrice,
                    status: this.status,
                },
            });

            const invoice = new Invoice(booking.id, this.totalPrice, new Date(), PaymentStatus.Pending);
            await invoice.save();
            return invoice;
        } catch (error) {
            console.error('Error saving booking:', error);
            return null
        }
    }
}

export default Booking;