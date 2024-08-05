import {BookingStatus, NotificationType, PaymentStatus, PrismaClient, SlotStatus, SlotType} from '@prisma/client';

const prisma = new PrismaClient();

class Statistic {
    // It's generally better to use a shared instance of PrismaClient for static methods
    // Alternatively, you can convert the methods to instance methods and utilize the instance from the constructor

    static async getTotalBookings(): Promise<number> {
        try {
            return await prisma.booking.count();
        } catch (error) {
            console.error("Error fetching total bookings:", error);
            return 0; // Or handle the error as appropriate
        }
    }

    static async getBookingsByStatus(status: BookingStatus): Promise<number> {
        try {
            return await prisma.booking.count({
                where: {status: BookingStatus.Pending}
            });
        } catch (error) {
            console.error("Error fetching bookings by status:", error);
            return 0;
        }
    }

    static async getSlotStatistics(): Promise<{
        [key in SlotType]: {
            available: number,
            occupied: number,
            reserved: number
        }
    }> {
        try {
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
        } catch (error) {
            console.error("Error fetching slot statistics:", error);
            return {
                [SlotType.Car]: {available: 0, occupied: 0, reserved: 0},
                [SlotType.Motorbike]: {available: 0, occupied: 0, reserved: 0}
            };
        }
    }

    static async getPaymentStatistics(): Promise<{ [key in PaymentStatus]: number }> {
        try {
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
        } catch (error) {
            console.error("Error fetching payment statistics:", error);
            return {
                [PaymentStatus.Pending]: 0,
                [PaymentStatus.Completed]: 0,
                [PaymentStatus.Failed]: 0
            };
        }
    }

    static async getNotificationStatistics(): Promise<{ [key in NotificationType]: number }> {
        try {
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
        } catch (error) {
            console.error("Error fetching notification statistics:", error);
            return {
                [NotificationType.Push]: 0,
                [NotificationType.Email]: 0
            };
        }
    }

    static async getTotalRevenue(): Promise<number> {
        try {
            const invoices = await prisma.invoice.findMany({
                where: {status: PaymentStatus.Completed},
                select: {amount: true}
            });

            const totalRevenue = invoices.reduce((total, invoice) => total + invoice.amount, 0);
            return totalRevenue;
        } catch (error) {
            console.error("Error fetching total revenue:", error);
            return 0;
        }
    }
}

export default Statistic;
