import { Router } from 'express';
import { createTicket, getOpenTickets, replyTicket, getMyTickets } from '../controllers/ticketController.js';

const router = Router();

router.post('/',          createTicket);
router.get('/open',       getOpenTickets);
router.patch('/:id/reply', replyTicket);
router.get('/mine',       getMyTickets);

export default router;
