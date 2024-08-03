import User from './User';
import { Role, BookingStatus, PrismaClient } from "@prisma/client";
import Booking from './Booking';

const prisma = new PrismaClient();

class Customer extends User {
    constructor(name: string, email: string, password: string) {
        super(name, email, password, Role.Customer);
    }

    async createBooking(slotId: number, startTime: Date, endTime: Date, totalPrice: number): Promise<Booking | null> {
        if (this.id === undefined) {
            console.log('Customer ID is not set');
            return null;
        }

        const booking = new Booking(
            this.id,
            slotId,
            startTime,
            endTime,
            totalPrice,
            BookingStatus.Pending
        );

        const result = await booking.save();

        if (result) {
            return booking
        }
        else {
            return null;
        }
    }

    static async findCustomerById(id: number): Promise<Customer | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (user && user.role === Role.Customer) {
                const customer = new Customer(user.name, user.email, user.password);
                customer.id = user.id
                return customer
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }
    }
}

export default Customer;