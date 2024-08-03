import {PrismaClient, BookingStatus} from '@prisma/client';
import SlotManager from "./SlotManager";
import ParkingSlot from "./ParkingSlot";

const prisma = new PrismaClient();

class Booking {
    public customerId: number;
    public slotId: number;
    public startTime: Date;
    public endTime: Date;
    public totalPrice: number;
    public status: BookingStatus;
    public id: number;

    private parkingLot: SlotManager = SlotManager.getInstance()


    constructor(customerId: number, slotId: number, startTime: Date, endTime: Date, totalPrice: number, status: BookingStatus) {
        this.customerId = customerId;
        this.slotId = slotId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    static async getBookingsByUid(id: string): Promise<Booking[] | Error> {
        try {
            const books = await prisma.booking.findMany();
            return books.map(book => new Booking(book.customerId, book.slotId, book.startTime, book.endTime, book.totalPrice, book.status));
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return Error('Failed to fetch bookings');
        }
    }
    async upsertBooking(booking : Booking): Promise<boolean> {
        try {
            const result = await prisma.booking.upsert({
                where: {
                    id: booking.id
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
                    id: booking.id,
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