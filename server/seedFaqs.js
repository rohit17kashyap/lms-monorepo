import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faq from './models/Faq.js';

dotenv.config({ path: '../.env' });

const faqs = [
  // --- registration ---
  {
    question: 'How do I register on the platform?',
    answer:
      'To register, click the "Sign Up" button on the homepage and fill in your name, email, and password. After submitting, check your email for a verification link to activate your account.',
    keywords: ['register', 'signup', 'create account', 'new user'],
    category: 'registration',
  },
  {
    question: 'My verification email did not arrive.',
    answer:
      'Please check your spam or junk folder first — the email may have landed there. If it is still missing, click "Resend Verification Email" on the login page or contact support.',
    keywords: ['email', 'verify', 'verification', 'not received'],
    category: 'registration',
  },
  {
    question: 'I forgot my password, how to reset it?',
    answer:
      'Click "Forgot Password?" on the login page and enter your registered email address. You will receive a password reset link within a few minutes.',
    keywords: ['forgot', 'password', 'reset', 'change'],
    category: 'registration',
  },
  {
    question: 'I already have an account but cannot login.',
    answer:
      'Make sure you are using the correct email and password. If your account is unverified, check your inbox for the verification email. For persistent issues, use "Forgot Password?" or contact support.',
    keywords: ['login', 'cant login', 'account', 'access'],
    category: 'registration',
  },

  // --- courses ---
  {
    question: 'How do I enroll in a course?',
    answer:
      'Browse the course catalog, open the course you want, and click the "Enroll Now" or "Buy Course" button. After successful payment, the course will appear in your dashboard immediately.',
    keywords: ['enroll', 'join', 'course', 'buy'],
    category: 'courses',
  },
  {
    question: 'The course video is not playing.',
    answer:
      'Try refreshing the page and clearing your browser cache. If the issue persists, switch to a different browser or check your internet connection — videos require a stable connection to stream.',
    keywords: ['video', 'not playing', 'buffering', 'stuck'],
    category: 'courses',
  },
  {
    question: 'I paid but the course is not showing.',
    answer:
      'Payment confirmation can take up to 5 minutes to reflect. Please refresh your dashboard or log out and log back in. If the course is still missing after 10 minutes, contact support with your transaction ID.',
    keywords: ['paid', 'course not showing', 'not unlocked', 'payment done'],
    category: 'courses',
  },
  {
    question: 'How do I message my instructor?',
    answer:
      'Open the course page and navigate to the "Discussion" or "Q&A" tab. You can post a question or send a direct message to the instructor from there.',
    keywords: ['instructor', 'teacher', 'message', 'contact'],
    category: 'courses',
  },
  {
    question: 'How long do I have access to a course?',
    answer:
      'Once enrolled, you have lifetime access to the course unless stated otherwise on the course page. You can revisit lectures and resources at any time from your dashboard.',
    keywords: ['access', 'duration', 'expire', 'validity'],
    category: 'courses',
  },

  // --- lab_exam ---
  {
    question: 'Where can I see my lab exam schedule?',
    answer:
      'Your lab exam schedule is available under "My Exams" in your student dashboard. You will also receive an email notification at least 48 hours before the exam date.',
    keywords: ['lab', 'exam', 'schedule', 'date', 'timetable'],
    category: 'lab_exam',
  },
  {
    question: 'How do I submit my lab assignment?',
    answer:
      'Navigate to the relevant course, open the "Lab Assignments" section, and click "Upload Submission." You can upload files in ZIP, PDF, or code format before the deadline.',
    keywords: ['submit', 'lab', 'assignment', 'upload'],
    category: 'lab_exam',
  },
  {
    question: 'What if I miss a lab exam?',
    answer:
      'If you miss a lab exam due to an emergency, contact your instructor or the admin team immediately with your reason. Rescheduling is subject to availability and is not guaranteed.',
    keywords: ['missed', 'absent', 'lab', 'exam', 'reschedule'],
    category: 'lab_exam',
  },
  {
    question: 'When will my lab exam result be announced?',
    answer:
      'Lab exam results are typically published within 5–7 working days of the exam date. You will be notified by email and the result will appear in your "My Results" section.',
    keywords: ['lab', 'result', 'marks', 'score', 'when'],
    category: 'lab_exam',
  },

  // --- payment ---
  {
    question: 'My payment failed, what should I do?',
    answer:
      'First, check whether the amount was deducted from your bank account. If it was, the payment usually auto-reverses within 5–7 business days. If you are still unable to pay, try a different payment method or contact support.',
    keywords: ['payment failed', 'error', 'transaction', 'failed'],
    category: 'payment',
  },
  {
    question: 'How do I get a refund?',
    answer:
      'Refund requests can be raised within 7 days of purchase through the "My Orders" section. Refunds are processed within 7–10 business days back to your original payment method.',
    keywords: ['refund', 'money back', 'cancel', 'return'],
    category: 'payment',
  },
  {
    question: 'Which payment methods are accepted?',
    answer:
      'We accept UPI, credit/debit cards, net banking, and wallets via Razorpay. All transactions are secured with 256-bit SSL encryption.',
    keywords: ['payment', 'methods', 'UPI', 'card', 'Razorpay'],
    category: 'payment',
  },
  {
    question: 'Payment was successful but the course is still locked.',
    answer:
      'This can happen due to a temporary sync delay. Please log out, wait 2–3 minutes, and log back in. If the course remains locked, contact support with your payment receipt and we will unlock it manually.',
    keywords: ['payment done', 'course locked', 'not unlocked', 'deducted'],
    category: 'payment',
  },

  // --- certificate ---
  {
    question: 'When will I receive my certificate?',
    answer:
      'Your certificate is generated automatically once you complete all course modules and pass the final assessment. It is usually available within 24 hours of course completion.',
    keywords: ['certificate', 'when', 'completion', 'get'],
    category: 'certificate',
  },
  {
    question: 'How do I download my certificate?',
    answer:
      'Go to "My Courses," open the completed course, and click the "Download Certificate" button. The certificate will be downloaded as a PDF that you can share or print.',
    keywords: ['download', 'certificate', 'PDF', 'save'],
    category: 'certificate',
  },
  {
    question: 'My certificate shows the wrong name.',
    answer:
      'Certificate names are pulled from your profile. Update your full name under "Account Settings" and then request a certificate re-generation from the course page or contact support.',
    keywords: ['certificate', 'wrong name', 'error', 'name mistake'],
    category: 'certificate',
  },

  // --- quiz ---
  {
    question: 'How do I attempt a quiz?',
    answer:
      'Open the relevant course module and click "Start Quiz." Make sure you have a stable internet connection before beginning, as quizzes are timed and auto-submit on expiry.',
    keywords: ['quiz', 'attempt', 'start', 'how to'],
    category: 'quiz',
  },
  {
    question: 'My quiz is not submitting.',
    answer:
      'If the submit button is unresponsive, check your internet connection and try refreshing the page. Your answers are usually auto-saved. If the issue persists, contact support immediately so your attempt is recorded.',
    keywords: ['quiz', 'submit', 'stuck', 'not submitting'],
    category: 'quiz',
  },
  {
    question: 'How can I check my quiz score?',
    answer:
      'After submitting, your score appears instantly on the results screen. You can also review all past quiz scores under "My Progress" in your student dashboard.',
    keywords: ['quiz', 'score', 'result', 'marks', 'check'],
    category: 'quiz',
  },
  {
    question: 'Can I retake a quiz?',
    answer:
      'Retake availability depends on the course settings configured by the instructor. If retakes are allowed, a "Retake Quiz" button will appear on the results screen after your first attempt.',
    keywords: ['retake', 'quiz', 'again', 'reattempt', 'redo'],
    category: 'quiz',
  },

  // --- account ---
  {
    question: 'How do I update my profile information?',
    answer:
      'Click your avatar in the top-right corner and select "Profile Settings." From there you can update your name, profile photo, bio, and contact details.',
    keywords: ['profile', 'update', 'edit', 'photo', 'name'],
    category: 'account',
  },
  {
    question: 'How do I change my password?',
    answer:
      'Go to "Account Settings" → "Security" and click "Change Password." You will need to enter your current password before setting a new one.',
    keywords: ['change', 'password', 'update', 'security'],
    category: 'account',
  },
  {
    question: 'My account has been deactivated.',
    answer:
      'Account deactivation usually happens due to a policy violation or inactivity. Please contact our support team with your registered email and we will review your case within 2 business days.',
    keywords: ['account', 'deactivated', 'blocked', 'disabled'],
    category: 'account',
  },

  // --- general ---
  {
    question: 'How do I contact support?',
    answer:
      'You can reach our support team via the "Help" section in your dashboard, by emailing support@lmsplatform.com, or by using the live chat option available Monday to Saturday, 9 AM – 6 PM.',
    keywords: ['contact', 'support', 'help', 'reach'],
    category: 'general',
  },
  {
    question: 'What are the platform working hours?',
    answer:
      'The platform is available 24/7 for self-paced learning. The support team is available Monday to Saturday, 9 AM – 6 PM IST. Response time for email queries is within 24 hours.',
    keywords: ['working hours', 'available', 'timing', 'support hours'],
    category: 'general',
  },
  {
    question: 'I have a technical issue not covered here.',
    answer:
      'Please describe your issue in detail and contact our support team via the "Report a Bug" option in the Help section. Include screenshots if possible so we can resolve it faster.',
    keywords: ['technical', 'issue', 'problem', 'bug'],
    category: 'general',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Faq.deleteMany({});
  await Faq.insertMany(faqs);
  console.log(`✅ Seeded ${faqs.length} FAQs into chatbot_db`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
