import {PrismaClient, BookingStatus, PaymentStatus, SlotStatus} from '@prisma/client';
import SlotManager from './SlotManager';
import Invoice from './Invoice';
import INotifySubject from "../interfaces/INotifySubject";
import INotifyObserver from "../interfaces/INotifyObserver";
import ParkingSlot from "./ParkingSlot"; // Ensure the path is correct

const prisma = new PrismaClient();

class Booking implements INotifySubject {

    public customerId: number;
    public slotId: number;
    public startTime: Date;
    public endTime: Date;
    public totalPrice: number;
    public status: BookingStatus;
    public id?: number | null;
    private observers: Array<INotifyObserver> = [];

    constructor(customerId: number, slotId: number, startTime: Date, endTime: Date, totalPrice: number, status: BookingStatus, id?: number) {
        this.customerId = customerId;
        this.slotId = slotId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalPrice = totalPrice;
        this.status = status;
        this.id = id || null
    }

    static async getSlotById(id: number): Promise<Booking | Error> {
        try {
            const booking = await prisma.booking.findUnique({
                where: {id: id},
            });
            if (!booking) {
                return Error("Booking not found");
            } else {
                return new Booking(booking.customerId, booking.slotId, booking.startTime, booking.endTime, booking.totalPrice, booking.status, booking.id);
            }


        } catch (error) {
            console.error("Error fetching parking slot:", error);
            return Error("Slot not found");
        }
    }

    static async getBookingByUId(userId: number): Promise<Booking[] | Error> {
        try {
            const books = await prisma.booking.findMany({
                where: {customerId: userId},
            });
            if (!books) {
                return Error("Booking not found");
            } else {
                return books.map(booking => new Booking(booking.customerId, booking.slotId, booking.startTime, booking.endTime, booking.totalPrice, booking.status, booking.id));
            }
        } catch (error) {
            console.error("Error fetching booking:", error);
            return Error("Booking not found");
        }
    }

    static async insertBooking(booking: Booking): Promise<boolean> {
        try {
            const book = await prisma.booking.create({
                data: {
                    customerId: booking.customerId,
                    slotId: booking.slotId,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    totalPrice: booking.totalPrice,
                    status: booking.status,
                },
            });
            const invoice = new Invoice(book.id, booking.totalPrice, new Date(), PaymentStatus.Pending);
            await invoice.createInvoice();

            await prisma.parkingSlot.update({
                where: {id: booking.slotId},
                data: {status: SlotStatus.Reserved},
            });

            return true;
        } catch (error) {
            console.error('Error upsert booking:', error);
            return false;
        }
    }

    static async updateBooking(booking: Booking): Promise<boolean> {
        try {
            const result = await prisma.booking.update({
                where: {
                    id: booking.id || 0
                },
                data: {
                    customerId: booking.customerId,
                    slotId: booking.slotId,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    totalPrice: booking.totalPrice,
                    status: booking.status,
                }
            });
            return true;
        } catch (error) {
            console.error('Error upsert booking:', error);
            return false;
        }
    }

    static async deleteBooking(booking: Booking): Promise<boolean> {
        try {
            if (booking.id) {
                const delInvoice = await Invoice.deleteInvoice(booking.id);
                if (delInvoice) {
                    const result = await prisma.booking.delete({
                        where: {
                            id: booking.id || 0,
                        },
                    });
                }
                await prisma.parkingSlot.update({
                    where: {id: booking.slotId},
                    data: {status: SlotStatus.Available},
                });

            }
            return true;
        } catch (error) {
            console.error('Error delete parking slot:', error);
            return false;
        }
    }

    attach(observer: INotifyObserver): void {
        this.observers.push(observer);
    }

    detach(observer: INotifyObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex);
    }

    notifyAllObservers(message: string): { [key: string]: string } {
        const result: { [key: string]: string } = {};
        for (const observer of this.observers) {
            result[observer.getType()] = observer.send(message);
        }
        return result;
    }
}

export default Booking;