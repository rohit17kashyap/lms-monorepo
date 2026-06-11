import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    keywords: [String],
    category: {
      type: String,
      enum: ['registration', 'courses', 'lab_exam', 'payment', 'certificate', 'quiz', 'account', 'general'],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Faq', faqSchema);
