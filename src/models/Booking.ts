import {PrismaClient, BookingStatus, PaymentStatus} from '@prisma/client';
import SlotManager from './SlotManager';
import Invoice from './Invoice'; // Ensure the path is correct

const prisma = new PrismaClient();

class Booking {

    public customerId: number;
    public slotId: number;
    public startTime: Date;
    public endTime: Date;
    public totalPrice: number;
    public status: BookingStatus;
    public id?: number | null;

    private slotManager: SlotManager = SlotManager.getInstance()


    constructor(customerId: number, slotId: number, startTime: Date, endTime: Date, totalPrice: number, status: BookingStatus, id? : number) {
        this.customerId = customerId;
        this.slotId = slotId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalPrice = totalPrice;
        this.status = status;
        this.id = id || null
    }

    async save(): Promise<Invoice | null> {
        try {
            const slot = await this.slotManager

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
    async upsertBooking(booking : Booking): Promise<boolean> {
        try {
            const result = await prisma.booking.upsert({
                where: {
                    id: booking.id || 0
                },
                update: {
                    customerId: booking.customerId,
                    slotId: booking.slotId,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    totalPrice: booking.totalPrice,
                    status: booking.status,
                },
                create: {
                    customerId: booking.customerId,
                    slotId: booking.slotId,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    totalPrice: booking.totalPrice,
                    status: booking.status,
                },
            });
            return true;
        } catch (error) {
            console.error('Error upsert booking:', error);
            return false;
        }
    }
    async deleteBooking(booking: Booking) : Promise<boolean>
    {
        try {
            const result = await prisma.booking.delete({
                where: {
                    id: booking.id || 0,
                },
            });
            return true;
        } catch (error) {
            console.error('Error delete parking slot:', error);
            return false;
        }
    }
}

export default Booking;