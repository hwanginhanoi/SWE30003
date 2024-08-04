import User from './User';
import { Role, BookingStatus, PrismaClient } from "@prisma/client";
import Booking from './Booking';

const prisma = new PrismaClient();

class Customer extends User {
    constructor(name: string, email: string, password: string) {
        super(name, email, password, Role.Customer);
    }
}

export default Customer;