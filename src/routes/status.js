import express from 'express';
import statusController from '../controllers/status.js';
import validationResultReq from '../middlewares/validationResultReq.js';

const router = express.Router();

router.get('/', validationResultReq, statusController.status);

export default router;
