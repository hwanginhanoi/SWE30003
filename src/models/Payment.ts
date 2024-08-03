import { PrismaClient, PaymentMethod, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

class Payment {
    public invoiceId: number;
    public amount: number;
    public method: PaymentMethod;
    public status: PaymentStatus;
    public date: Date;

    constructor(invoiceId: number, amount: number, method: PaymentMethod) {
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.method = method;
        this.status = PaymentStatus.Pending;
        this.date = new Date();
    }

    async save(): Promise<void> {
        try {
            await prisma.payment.create({
                data: {
                    invoiceId: this.invoiceId,
                    amount: this.amount,
                    method: this.method,
                    status: this.status,
                    date: this.date,
                },
            });

            await prisma.invoice.update({
                where: { id: this.invoiceId },
                    data: { status: PaymentStatus.Completed },
            });
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    }
}

export default Payment;