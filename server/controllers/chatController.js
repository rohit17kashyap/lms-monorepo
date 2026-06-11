import Faq from '../models/Faq.js';
import ChatMessage from '../models/ChatMessage.js';
import matchFaq from '../services/faqMatcher.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId, userId = null } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required.' });
    }

    const faqs = await Faq.find({ isActive: true });
    const result = matchFaq(message.trim(), faqs);

    if (result) {
      const { faq, confidence } = result;

      await ChatMessage.create({
        sessionId,
        userId,
        userMessage: message.trim(),
        botReply: faq.answer,
        source: 'faq',
        matchedFaq: faq._id,
        confidence,
      });

      return res.json({
        success: true,
        reply: faq.answer,
        source: 'faq',
        confidence,
        category: faq.category,
        canEscalate: true,
      });
    }

    const fallbackReply =
      "I couldn't find an answer to that. Would you like to connect with a teacher or admin?";

    await ChatMessage.create({
      sessionId,
      userId,
      userMessage: message.trim(),
      botReply: fallbackReply,
      source: 'fallback',
      confidence: 0,
    });

    return res.json({
      success: true,
      reply: fallbackReply,
      source: 'fallback',
      canEscalate: true,
    });
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true });
    return res.json({ success: true, faqs });
  } catch (err) {
    console.error('getAllFaqs error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
