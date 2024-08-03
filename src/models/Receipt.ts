import { PrismaClient, PaymentMethod, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

class Receipt {
    public id: number;
    public invoiceId: number;
    public method: PaymentMethod;
    public status: PaymentStatus;
    public amount: number;
    public date: Date;

    constructor(id: number, invoiceId: number, method: PaymentMethod, status: PaymentStatus, amount: number, date: Date) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.method = method;
        this.status = status;
        this.amount = amount;
        this.date = date;
    }

    static async createReceipt(invoiceId: number, method: PaymentMethod, amount: number): Promise<Receipt | null> {
        try {
            const receipt = await prisma.receipt.create({
                data: {
                    invoiceId,
                    method,
                    amount,
                    status: PaymentStatus.Pending, // default status
                },
            });

            return new Receipt(
                receipt.id,
                receipt.invoiceId,
                receipt.method,
                receipt.status,
                receipt.amount,
                receipt.date
            );
        } catch (error) {
            console.error('Error creating receipt:', error);
            return null;
        }
    }

    static async updateReceiptStatus(id: number, status: PaymentStatus): Promise<Receipt | null> {
        try {
            const updatedReceipt = await prisma.receipt.update({
                where: { id },
                data: { status },
            });

            return new Receipt(
                updatedReceipt.id,
                updatedReceipt.invoiceId,
                updatedReceipt.method,
                updatedReceipt.status,
                updatedReceipt.amount,
                updatedReceipt.date
            );
        } catch (error) {
            console.error('Error updating receipt status:', error);
            return null;
        }
    }

    static async getReceiptById(id: number): Promise<Receipt | null> {
        try {
            const receipt = await prisma.receipt.findUnique({
                where: { id },
            });

            if (receipt) {
                return new Receipt(
                    receipt.id,
                    receipt.invoiceId,
                    receipt.method,
                    receipt.status,
                    receipt.amount,
                    receipt.date
                );
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching receipt by ID:', error);
            return null;
        }
    }
}

export default Receipt;