import db from '../databases/connect.js';
import Bookings from '../models/Bookings.js';
import Tickets from '../models/Tickets.js';
import createErr from '../utils/errUtils.js';

class bookingService {
    async updateDocumentById(models, id, updateField) {
        return models.findByIdAndUpdate(id, updateField, { new: true });
    }

    async decreaseTicketRemaining(ticketId) {
        const ticket = await this.updateDocumentById(Tickets, ticketId, {
            $inc: { remaining: -1 },
        });

        if (!ticket || ticket.remaining < 0) {
            throw createErr('Ticket not available or sold out', 400);
        }

        return ticket;
    }

    async createBooking(userName, ticketId) {
        const ticket = await Tickets.findById(ticketId);
        if (!ticket || ticket.remaining <= 0) {
            throw createErr('Ticket not available or sold out', 400);
        }

        const saveBooking = await Bookings.create({ userName, ticketId });
        return saveBooking;
    }

    async confirmBooking(bookingId) {
        const booking = await Bookings.findOneAndUpdate(
            { _id: bookingId, confirmed: false, canceled: false },
            {
                confirmed: true,
                paymentInfo: 'Payment successful',
            },
            {
                new: true,
            }
        );

        if (!booking || booking.canceled) {
            const errorMessage = !booking
                ? 'Booking not found or already confirmed'
                : 'Booking canceled';
            throw createErr(errorMessage, 400);
        }

        return booking;
    }

    async refundBooking(bookingId) {
        const booking = await Bookings.findById(bookingId);

        if (!booking) {
            throw createErr('Booking not found', 400);
        }
        if (booking.canceled || !booking.confirmed) {
            const errorMessage = booking.canceled
                ? 'Booking canceled'
                : 'Booking not confirmed';

            throw createErr(errorMessage, 400);
        }

        const updateBooking = await this.updateDocumentById(
            Bookings,
            bookingId,
            {
                canceled: true,
            }
        );

        const ticket = await this.updateDocumentById(
            Tickets,
            updateBooking.ticketId,
            {
                $inc: { remaining: +1 },
            }
        );

        if (!ticket) {
            throw createErr('Ticket not found', 400);
        }

        const refundAmount = ticket.price * 0.9;

        return { ticket, refundAmount };
    }

    async cancelBooking(bookingId) {
        const booking = await Bookings.findOneAndUpdate(
            { _id: bookingId, canceled: { $ne: true } },
            {
                canceled: true,
                paymentInfo: 'Booking Canceled',
            },
            { new: true }
        );

        if (!booking) {
            throw createErr('Booking not found or alrealdy canceled', 400);
        }

        if (booking) {
            const ticket = await this.updateDocumentById(
                Tickets,
                booking.ticketId,
                {
                    // Tăng vé lên 1 khi hủy
                    $inc: { remaining: +1 },
                }
            );
            if (!ticket) throw createErr('Ticket not found', 400);

            const refundAmount = booking.confirmed
                ? ticket.price * 0.9
                : ticket.price;

            return refundAmount;
        }

        throw createErr('Booking not found', 400);
    }

    async autoCancel() {
        let cancelCount = 0;
        const now = new Date();
        const autoCancelTime = 5 * 60 * 1000; // 5 minutes

        const bookings = await Bookings.find({
            confirmed: false,
            autoCanceled: { $ne: true }, // tìm các autoCanceled không phải là true
        });

        for (let booking of bookings) {
            // Chưa xác nhận và quá 5p, hệ thống tự động hủy
            if (now - booking.createdAt > autoCancelTime) {
                const ticketUpdate = await this.updateDocumentById(
                    Tickets,
                    booking.ticketId,
                    {
                        $inc: { remaining: 1 },
                    }
                );

                if (ticketUpdate) {
                    await this.updateDocumentById(Bookings, booking._id, {
                        canceled: true,
                        autoCanceled: true,
                        paymentInfo: 'Booking Canceled',
                    });
                }

                cancelCount += 1;
            }
        }

        return {
            message:
                cancelCount > 0
                    ? 'Auto cancellation executed'
                    : 'No bookings were auto-canceled.',
        };
    }
}

export default new bookingService();
