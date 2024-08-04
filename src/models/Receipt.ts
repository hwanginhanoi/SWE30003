import {PaymentMethod, PaymentStatus, PrismaClient} from '@prisma/client';
import INotifySubject from "../interfaces/INotifySubject";
import INotifyObserver from "../interfaces/INotifyObserver";

const prisma = new PrismaClient();

class Receipt implements INotifySubject{
    public id: number;
    public invoiceId: number;
    public method: PaymentMethod;
    public status: PaymentStatus;
    public amount: number;
    public date: Date;
    private observers: INotifyObserver[] = [];

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
                    status: PaymentStatus.Completed,
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

    static async getReceiptsByUserId(userId: number) {
        try {
            return await prisma.receipt.findMany({
                where: {
                    invoice: {
                        booking: {
                            customerId: userId,
                        },
                    },
                },
                include: {
                    invoice: {
                        include: {
                            booking: true,
                        },
                    },
                },
            });
        } catch (error) {
            console.error('Error fetching receipts:', error);
            return null;
        }
    }

    attach(observer: INotifyObserver): void {
        this.observers.push(observer);
    }

    detach(observer: INotifyObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex);
    }

    notifyAllObserver(): void {
        for (const observer of this.observers) {
            observer.send(`Receipt ID ${this.id} has been updated to ${this.status}`);
        }
    }
}

export default Receipt;