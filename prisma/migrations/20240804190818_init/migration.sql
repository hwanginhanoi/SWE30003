-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_bookingId_fkey";

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
