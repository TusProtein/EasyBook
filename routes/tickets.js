import express from 'express';
import Tickets from '../models/Tickets.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const tickets = await Tickets.find();
    return res.json(tickets);
});

export default router;
