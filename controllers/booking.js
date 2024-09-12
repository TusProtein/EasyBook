import bookingService from '../services/booking.js';
class bookingController {
    async book(req, res, next) {
        try {
            const { userName, ticketId } = req.body;

            const ticket = await bookingService.decreaseTicketRemaining(
                ticketId
            );

            const booking = await bookingService.createBooking(
                userName,
                ticketId
            );

            return res.json({
                message: 'Ticket booked successfully',
                booking,
                ticket,
            });
        } catch (error) {
            next(error);
        }
    }

    async confirm(req, res, next) {
        const { bookingId } = req.body;

        try {
            const booking = await bookingService.confirmBooking(bookingId);

            return res.json({ message: 'Confirmed succesfull', booking });
        } catch (error) {
            next(error);
        }
    }

    async refund(req, res, next) {
        const { bookingId } = req.body;

        try {
            const result = await bookingService.refundBooking(bookingId);
            const { ticket, refundAmount } = result;

            return res.json({
                message: 'Booking refund 90%',
                refundAmount,
                ticket,
            });
        } catch (error) {
            next(error);
        }
    }

    async cancel(req, res, next) {
        const { bookingId } = req.body;
        try {
            const refundAmount = await bookingService.cancelBooking(bookingId);
            return res.json({
                message: 'Cancel and Refund successfully',
                refund: refundAmount,
            });
        } catch (error) {
            next(error);
        }
    }

    async autoCancel(req, res, next) {
        try {
            const result = await bookingService.autoCancel();
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new bookingController();
