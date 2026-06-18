import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketId:   { type: String, unique: true },
  userId:     { type: String, default: 'guest' },
  userName:   { type: String, default: 'User' },
  role:       { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  category:   { type: String, default: 'general' },
  query:      { type: String, required: true },
  status:     { type: String, enum: ['open', 'answered', 'closed'], default: 'open' },
  reply:      { type: String, default: '' },
  answeredBy: { type: String, default: '' },
  createdAt:  { type: Date,   default: Date.now },
  answeredAt: { type: Date,   default: null },
});

export default mongoose.model('SupportTicket', supportTicketSchema);
