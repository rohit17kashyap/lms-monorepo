import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: String, default: null },
    userMessage: { type: String, required: true },
    botReply: { type: String, required: true },
    source: { type: String, enum: ['faq', 'fallback'], default: 'faq' },
    matchedFaq: { type: mongoose.Schema.Types.ObjectId, ref: 'Faq', default: null },
    confidence: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
