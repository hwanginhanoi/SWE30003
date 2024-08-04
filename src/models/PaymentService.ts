import {PrismaClient, PaymentMethod, PaymentStatus, Invoice, SlotStatus} from '@prisma/client';
import Receipt from './Receipt';

const prisma = new PrismaClient();

class PaymentService {
    private static instance: PaymentService;

    private constructor() {}

    public static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    public async processPayment(invoiceId: number, amount: number, method: PaymentMethod): Promise<void> {
        try {
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId },
                include: {
                    booking: {
                        include: {
                            parkingSlot: true,
                        },
                    },
                },
            });

            if (!invoice) {
                console.log('Invoice not found');
                return;
            }

            if (invoice.status !== PaymentStatus.Pending) {
                console.log('Invoice has already been processed');
                return;
            }

            await prisma.invoice.update({
                where: { id: invoiceId },
                data: { status: PaymentStatus.Completed },
            });

            await prisma.booking.update({
                where: { id: invoice.bookingId },
                data: { status: PaymentStatus.Completed },
            });


            await prisma.parkingSlot.update({
                where: { id: invoice.booking.parkingSlot.id },
                data: { status: SlotStatus.Occupied },
            });

            const receipt = await Receipt.createReceipt(invoiceId, method, amount);

            if (!receipt) {
                console.log('Failed to create receipt');
            }

            console.log('Payment processed and receipt created successfully');
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    }
}

export default PaymentService;