import mongoose from 'mongoose';
const { Schema } = mongoose;

const Tickets = new Schema(
    {
        name: { type: String, required: true, maxLength: 255 },
        price: { type: Number, required: true },
        available: { type: Boolean, default: false },
        remaining: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Tickets', Tickets);
