import User from './User';
import { Role, BookingStatus } from "@prisma/client";
import Booking from './Booking';

class Customer extends User {
    constructor(name: string, email: string, password: string) {
        super(name, email, password, Role.Customer);
    }

    async createBooking(slotId: number, startTime: Date, endTime: Date, totalPrice: number): Promise<void> {
        if (this.id === undefined) {
            console.log('Customer ID is not set');
            return;
        }

        const booking = new Booking(
            this.id,
            slotId,
            startTime,
            endTime,
            totalPrice,
            BookingStatus.Pending
        );

        await booking.save();
    }
}

export default Customer;