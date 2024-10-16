// creditRoutes.js
import express from 'express';
import { purchaseCredits } from '../controllers/creditController.js';

const router = express.Router();

router.post('', purchaseCredits);

export default router;
