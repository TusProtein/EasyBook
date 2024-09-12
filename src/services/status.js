import createErr from '../utils/errUtils.js';
import db from '../databases/connect.js';
import Bookings from '../models/Bookings.js';

class statusService {
    async statusBooking(userName, errors) {
        const now = new Date();
        const autoCancelTime = 5 * 60 * 1000; // 5 minutes

        if (!errors.isEmpty()) {
            const errorMessage = errors.array();
            throw createErr(errorMessage, 400);
        }

        if (!userName) {
            throw createErr('User name is required', 404);
            // return res.status(404).json({ message:  });
        }
        const userBooking = await Bookings.find({ userName });

        if (userBooking.length === 0) {
            throw createErr('No bookings found for this user', 404);
        }

        const statuses = userBooking.map(
            ({
                id,
                ticketId,
                createdAt,
                canceled,
                autoCanceled,
                confirmed,
            }) => {
                const status = canceled
                    ? autoCanceled
                        ? 'Auto Canceled'
                        : 'Canceled'
                    : confirmed
                    ? 'Confirmed'
                    : now - createdAt > autoCancelTime
                    ? 'Auto Canceled'
                    : 'Pending confirmation';

                return {
                    bookingId: id,
                    ticketId,
                    status,
                };
            }
        );
        return {
            message: 'Booking statuses retrieved successfully',
            statuses,
        };
    }
}

export default new statusService();
