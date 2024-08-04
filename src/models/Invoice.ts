import {PrismaClient, PaymentStatus} from '@prisma/client';

const prisma = new PrismaClient();

class Invoice {
    public bookingId: number;
    public amount: number;
    public issueDate: Date;
    public status: PaymentStatus;
    public id?: number | null;

    constructor(invoiceId: number, amount: number, issueDate: Date, status: PaymentStatus, id?: number) {
        this.bookingId = invoiceId;
        this.amount = amount;
        this.issueDate = issueDate;
        this.status = status;
        this.id = id;
    }

    async createInvoice(): Promise<void> {
        try {
            await prisma.invoice.create({
                data: {
                    bookingId: this.bookingId,
                    amount: this.amount,
                    issueDate: this.issueDate,
                    status: this.status,
                },
            });
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    }

    static async deleteInvoice(invoiceId: number): Promise<boolean> {
        try {
            await prisma.invoice.delete({
                where: {
                    id: invoiceId,
                },
            });
            return true;
        } catch (error) {
            console.error('Error delete invoice:', error);
            return false;
        }
    }

    static async getBookingByUId(userId: number): Promise<Invoice[] | Error> {
        try {
            const bookings = await prisma.booking.findMany({
                where: { customerId: userId },
                select: { id: true },
            });

            if (bookings.length === 0) {
                return new Error('No bookings found for this user ID');
            }

            const bookingIds = bookings.map(booking => booking.id);


            const invoices = await prisma.invoice.findMany({
                where: { bookingId: { in: bookingIds } },
            });

            if (!invoices) {
                return Error("Booking not found");
            } else {
                return invoices.map(invoice => new Invoice(invoice.bookingId, invoice.amount, invoice.issueDate, invoice.status, invoice.id));
            }
        } catch (error) {
            console.error("Error fetching invoice:", error);
            return Error("Booking not found");
        }
    }
}

export default Invoice;