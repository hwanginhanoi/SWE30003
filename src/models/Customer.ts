import Account from './Account';
import { Role, BookingStatus } from "@prisma/client";
import Booking from './Booking';

class Customer extends Account {
    constructor(name: string, email: string, password: string) {
        super(name, email, password, Role.Customer);
    }

    async createBooking(slotId: number, startTime: Date, endTime: Date, totalPrice: number): Promise<void> {
        if (!this.id) {
            throw new Error('Customer ID is not set');
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