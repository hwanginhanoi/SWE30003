import {PaymentMethod, PaymentStatus, PrismaClient} from '@prisma/client';
import INotifySubject from "../interfaces/INotifySubject";
import INotifyObserver from "../interfaces/INotifyObserver";
import invoice from "./Invoice";

const prisma = new PrismaClient();

class Receipt implements INotifySubject {
    public id: number;
    public invoiceId: number;
    public method: PaymentMethod;
    public status: PaymentStatus;
    public amount: number;
    public date: Date;
    private observers: Array<INotifyObserver> = [];

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

    static async getReceiptsByInvoiceId(invoiceId: number): Promise<Receipt | Error> {
        try {
            const receipt=  await prisma.receipt.findUnique({
                where: {
                    invoiceId: invoiceId
                }
            });
            if (receipt) {
                return new Receipt(receipt.id, receipt.invoiceId, receipt.method, receipt.status, receipt.amount, receipt.date)
            } else
                return Error("Can not get receipt")
        } catch (error) {
            console.error('Error fetching receipts:', error);
            return Error("Error fetching receipt");
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

export default Receipt;