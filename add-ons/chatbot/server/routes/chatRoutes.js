import { Router } from 'express';
import { sendMessage, getAllFaqs } from '../controllers/chatController.js';

const router = Router();

router.post('/message', sendMessage);
router.get('/faqs', getAllFaqs);

export default router;
