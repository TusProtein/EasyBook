import express from 'express';
import bookingController from '../controllers/booking.js';

const router = express.Router();

router.post('/book', bookingController.book);

router.post('/confirm', bookingController.confirm);

router.post('/refund', bookingController.refund);

router.post('/cancel', bookingController.cancel);

router.get('/auto-cancel', bookingController.autoCancel);

export default router;
