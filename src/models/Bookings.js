import mongoose from 'mongoose';
const { Schema } = mongoose;

const Bookings = new Schema(
    {
        userName: { type: String, required: true },
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tickets',
            required: true,
        },
        bookingTime: { type: Date },
        confirmed: { type: Boolean, default: false },
        canceled: { type: Boolean, default: false },
        autoCanceled: { type: Boolean, default: false },
        paymentInfo: { type: String, default: 'Pending' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Bookings', Bookings);
