import SupportTicket from '../models/SupportTicket.js';

export const createTicket = async (req, res) => {
  try {
    const { userId = 'guest', userName = 'User', role = 'student', category = 'general', query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, error: 'Query is required.' });
    }

    const count    = await SupportTicket.countDocuments();
    const ticketId = `TKT-${1000 + count}`;

    await SupportTicket.create({ ticketId, userId, userName, role, category, query: query.trim() });

    return res.json({
      success: true,
      ticketId,
      autoReply: `Thanks for reaching out! 🙏 All our support agents are busy right now, but your request has been logged as ${ticketId}. Our team will get back to you soon. You can check 'My Requests' anytime to see the reply.`,
    });
  } catch (err) {
    console.error('createTicket error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

export const getOpenTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ status: 'open' }).sort({ createdAt: -1 });
    return res.json({ success: true, tickets });
  } catch (err) {
    console.error('getOpenTickets error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

export const replyTicket = async (req, res) => {
  try {
    const { reply, answeredBy = '' } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, error: 'Reply is required.' });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { reply: reply.trim(), answeredBy, status: 'answered', answeredAt: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }

    return res.json({ success: true, ticket });
  } catch (err) {
    console.error('replyTicket error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const { userId = 'guest' } = req.query;
    const tickets = await SupportTicket.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, tickets });
  } catch (err) {
    console.error('getMyTickets error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
