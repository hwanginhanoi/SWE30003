import {PrismaClient, BookingStatus, SlotType, SlotStatus, PaymentStatus, NotificationType} from '@prisma/client';

const prisma = new PrismaClient();

class Statistic {
    static async getTotalBookings(): Promise<number> {
        const count = await prisma.booking.count();
        return count;
    }

    static async getBookingsByStatus(status: BookingStatus): Promise<number> {
        const count = await prisma.booking.count({
            where: {status}
        });
        return count;
    }

    static async getSlotStatistics(): Promise<{
        [key in SlotType]: {
            available: number,
            occupied: number,
            reserved: number
        }
    }> {
        const slots = await prisma.parkingSlot.findMany({
            select: {
                type: true,
                status: true
            }
        });

        const stats = {
            [SlotType.Car]: {available: 0, occupied: 0, reserved: 0},
            [SlotType.Motorbike]: {available: 0, occupied: 0, reserved: 0}
        };

        slots.forEach(slot => {
            if (slot.status === SlotStatus.Available) {
                stats[slot.type].available++;
            } else if (slot.status === SlotStatus.Occupied) {
                stats[slot.type].occupied++;
            } else if (slot.status === SlotStatus.Reserved) {
                stats[slot.type].reserved++;
            }
        });

        return stats;
    }

    static async getPaymentStatistics(): Promise<{ [key in PaymentStatus]: number }> {
        const receipts = await prisma.receipt.findMany({
            select: {
                status: true
            }
        });

        const stats = {
            [PaymentStatus.Pending]: 0,
            [PaymentStatus.Completed]: 0,
            [PaymentStatus.Failed]: 0
        };

        receipts.forEach(receipt => {
            stats[receipt.status]++;
        });

        return stats;
    }

    static async getNotificationStatistics(): Promise<{ [key in NotificationType]: number }> {
        const notifications = await prisma.notification.findMany({
            select: {
                type: true
            }
        });

        const stats = {
            [NotificationType.Push]: 0,
            [NotificationType.Email]: 0
        };

        notifications.forEach(notification => {
            stats[notification.type]++;
        });

        return stats;
    }

    static async getTotalRevenue(): Promise<number> {
        const invoices = await prisma.invoice.findMany({
            where: {status: PaymentStatus.Completed},
            select: {amount: true}
        });

        const totalRevenue = invoices.reduce((total, invoice) => total + invoice.amount, 0);
        return totalRevenue;
    }
}

export default Statistic;