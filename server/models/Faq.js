import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    keywords: [String],
    category: {
      type: String,
      enum: [
        'registration', 'courses', 'lab_exam', 'virtual_lab', 'certificate', 'quiz', 'account', 'general',
        'course_management', 'content_upload', 'quiz_exam', 'live_class', 'teacher_account',
        'user_management', 'virtual_lab_admin', 'platform', 'admin_account',
      ],
    },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Faq', faqSchema);
