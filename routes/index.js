import express from 'express';
import bookingRouter from './booking.js';
import statusRouter from './status.js';
import ticketsRouter from './tickets.js';

const router = express.Router();

const routes = [
    {
        path: '/booking',
        router: bookingRouter,
    },

    {
        path: '/booking-status',
        router: statusRouter,
    },
    {
        path: '/tickets',
        router: ticketsRouter,
    },
];

routes.forEach((route) => router.use(route.path, route.router));

export default router;
