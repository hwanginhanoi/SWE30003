import {PrismaClient, PaymentStatus} from '@prisma/client';

const prisma = new PrismaClient();

class Invoice {
    public bookingId: number;
    public amount: number;
    public issueDate: Date;
    public status: PaymentStatus;

    constructor(bookingId: number, amount: number, issueDate: Date, status: PaymentStatus) {
        this.bookingId = bookingId;
        this.amount = amount;
        this.issueDate = issueDate;
        this.status = status;
    }

    async save(): Promise<void> {
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

    static async deleteInvoice(bookingId: number): Promise<boolean> {
        try {
            const result = await prisma.invoice.delete({
                where: {
                    bookingId: bookingId,
                },
            });
            return true;
        } catch (error) {
            console.error('Error delete invoice:', error);
            return false;
        }
    }
}

export default Invoice;