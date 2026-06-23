import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faq from './models/Faq.js';

dotenv.config({ path: '../.env' });

const faqs = [

  // ── STUDENT ──────────────────────────────────────────────────────────────

  // registration
  {
    question: 'How do I register on the platform?',
    answer: 'To register, click the "Sign Up" button on the homepage and fill in your name, email, and password. After submitting, check your email for a verification link to activate your account.',
    keywords: ['register', 'signup', 'create account', 'new user'],
    category: 'registration', role: 'student', isActive: true,
  },
  {
    question: 'My verification email did not arrive.',
    answer: 'Please check your spam or junk folder first — the email may have landed there. If it is still missing, click "Resend Verification Email" on the login page or contact support.',
    keywords: ['email', 'verify', 'verification', 'not received'],
    category: 'registration', role: 'student', isActive: true,
  },
  {
    question: 'I forgot my password, how to reset it?',
    answer: 'Click "Forgot Password?" on the login page and enter your registered email address. You will receive a password reset link within a few minutes.',
    keywords: ['forgot', 'password', 'reset', 'change'],
    category: 'registration', role: 'student', isActive: true,
  },
  {
    question: 'I already have an account but cannot login.',
    answer: 'Make sure you are using the correct email and password. If your account is unverified, check your inbox for the verification email. For persistent issues, use "Forgot Password?" or contact support.',
    keywords: ['login', 'cant login', 'account', 'access'],
    category: 'registration', role: 'student', isActive: true,
  },

  // courses
  {
    question: 'How do I enroll in a course?',
    answer: 'Browse the course catalog, open the course you want, and click the "Enroll Now" or "Buy Course" button. After successful enrollment, the course will appear in your dashboard immediately.',
    keywords: ['enroll', 'join', 'course', 'buy'],
    category: 'courses', role: 'student', isActive: true,
  },
  {
    question: 'The course video is not playing.',
    answer: 'Try refreshing the page and clearing your browser cache. If the issue persists, switch to a different browser or check your internet connection — videos require a stable connection to stream.',
    keywords: ['video', 'not playing', 'buffering', 'stuck'],
    category: 'courses', role: 'student', isActive: true,
  },
  {
    question: 'The course is not showing in my dashboard.',
    answer: 'First check your enrollment status under "My Courses" — the course should appear there if you are enrolled. Try logging out and back in to refresh your session. If the course is still missing, contact support with your enrollment details.',
    keywords: ['course', 'not showing', 'missing', 'dashboard'],
    category: 'courses', role: 'student', isActive: true,
  },
  {
    question: 'How do I message my instructor?',
    answer: 'Open the course page and navigate to the "Discussion" or "Q&A" tab. You can post a question or send a direct message to the instructor from there.',
    keywords: ['instructor', 'teacher', 'message', 'contact'],
    category: 'courses', role: 'student', isActive: true,
  },
  {
    question: 'How long do I have access to a course?',
    answer: 'Once enrolled, you have lifetime access to the course unless stated otherwise on the course page. You can revisit lectures and resources at any time from your dashboard.',
    keywords: ['access', 'duration', 'expire', 'validity'],
    category: 'courses', role: 'student', isActive: true,
  },

  // lab_exam
  {
    question: 'Where can I see my lab exam schedule?',
    answer: 'Your lab exam schedule is available under "My Exams" in your student dashboard. You will also receive an email notification at least 48 hours before the exam date.',
    keywords: ['lab', 'exam', 'schedule', 'date', 'timetable'],
    category: 'lab_exam', role: 'student', isActive: true,
  },
  {
    question: 'How do I submit my lab assignment?',
    answer: 'Navigate to the relevant course, open the "Lab Assignments" section, and click "Upload Submission." You can upload files in ZIP, PDF, or code format before the deadline.',
    keywords: ['submit', 'lab', 'assignment', 'upload'],
    category: 'lab_exam', role: 'student', isActive: true,
  },
  {
    question: 'What if I miss a lab exam?',
    answer: 'If you miss a lab exam due to an emergency, contact your instructor or the admin team immediately with your reason. Rescheduling is subject to availability and is not guaranteed.',
    keywords: ['missed', 'absent', 'lab', 'exam', 'reschedule'],
    category: 'lab_exam', role: 'student', isActive: true,
  },
  {
    question: 'When will my lab exam result be announced?',
    answer: 'Lab exam results are typically published within 5–7 working days of the exam date. You will be notified by email and the result will appear in your "My Results" section.',
    keywords: ['lab', 'result', 'marks', 'score', 'when'],
    category: 'lab_exam', role: 'student', isActive: true,
  },

  // virtual_lab (student)
  {
    question: 'How do I access the virtual lab?',
    answer: 'Log in to your student dashboard and navigate to the "Virtual Lab" section under your enrolled course. Click "Launch Lab" to open the lab environment in your browser — no installation is required.',
    keywords: ['access', 'virtual', 'lab', 'open', 'start'],
    category: 'virtual_lab', role: 'student', isActive: true,
  },
  {
    question: 'Virtual lab is not loading, what to do?',
    answer: 'Try refreshing the page and clearing your browser cache. Make sure you are using a supported browser (Chrome or Firefox recommended). If the lab still does not load, check your internet connection or contact support with a screenshot of the error.',
    keywords: ['virtual', 'lab', 'not loading', 'stuck', 'error'],
    category: 'virtual_lab', role: 'student', isActive: true,
  },
  {
    question: 'How do I submit my virtual lab work?',
    answer: 'Once you have completed your work inside the virtual lab, click the "Save & Submit" button within the lab interface. Your work is automatically captured and sent to your instructor for review.',
    keywords: ['submit', 'virtual', 'lab', 'work', 'save'],
    category: 'virtual_lab', role: 'student', isActive: true,
  },
  {
    question: 'Can I use the virtual lab from home?',
    answer: 'Yes, the virtual lab is fully browser-based and accessible from any location with a stable internet connection. Simply log in to your account and launch the lab from your dashboard as usual.',
    keywords: ['virtual', 'lab', 'home', 'remote', 'access'],
    category: 'virtual_lab', role: 'student', isActive: true,
  },

  // certificate
  {
    question: 'When will I receive my certificate?',
    answer: 'Your certificate is generated automatically once you complete all course modules and pass the final assessment. It is usually available within 24 hours of course completion.',
    keywords: ['certificate', 'when', 'completion', 'get'],
    category: 'certificate', role: 'student', isActive: true,
  },
  {
    question: 'How do I download my certificate?',
    answer: 'Go to "My Courses," open the completed course, and click the "Download Certificate" button. The certificate will be downloaded as a PDF that you can share or print.',
    keywords: ['download', 'certificate', 'PDF', 'save'],
    category: 'certificate', role: 'student', isActive: true,
  },
  {
    question: 'My certificate shows the wrong name.',
    answer: 'Certificate names are pulled from your profile. Update your full name under "Account Settings" and then request a certificate re-generation from the course page or contact support.',
    keywords: ['certificate', 'wrong name', 'error', 'name mistake'],
    category: 'certificate', role: 'student', isActive: true,
  },

  // quiz
  {
    question: 'How do I attempt a quiz?',
    answer: 'Open the relevant course module and click "Start Quiz." Make sure you have a stable internet connection before beginning, as quizzes are timed and auto-submit on expiry.',
    keywords: ['quiz', 'attempt', 'start', 'how to'],
    category: 'quiz', role: 'student', isActive: true,
  },
  {
    question: 'My quiz is not submitting.',
    answer: 'If the submit button is unresponsive, check your internet connection and try refreshing the page. Your answers are usually auto-saved. If the issue persists, contact support immediately so your attempt is recorded.',
    keywords: ['quiz', 'submit', 'stuck', 'not submitting'],
    category: 'quiz', role: 'student', isActive: true,
  },
  {
    question: 'How can I check my quiz score?',
    answer: 'After submitting, your score appears instantly on the results screen. You can also review all past quiz scores under "My Progress" in your student dashboard.',
    keywords: ['quiz', 'score', 'result', 'marks', 'check'],
    category: 'quiz', role: 'student', isActive: true,
  },
  {
    question: 'Can I retake a quiz?',
    answer: 'Retake availability depends on the course settings configured by the instructor. If retakes are allowed, a "Retake Quiz" button will appear on the results screen after your first attempt.',
    keywords: ['retake', 'quiz', 'again', 'reattempt', 'redo'],
    category: 'quiz', role: 'student', isActive: true,
  },

  // account
  {
    question: 'How do I update my profile information?',
    answer: 'Click your avatar in the top-right corner and select "Profile Settings." From there you can update your name, profile photo, bio, and contact details.',
    keywords: ['profile', 'update', 'edit', 'photo', 'name'],
    category: 'account', role: 'student', isActive: true,
  },
  {
    question: 'How do I change my password?',
    answer: 'Go to "Account Settings" → "Security" and click "Change Password." You will need to enter your current password before setting a new one.',
    keywords: ['change', 'password', 'update', 'security'],
    category: 'account', role: 'student', isActive: true,
  },
  {
    question: 'My account has been deactivated.',
    answer: 'Account deactivation usually happens due to a policy violation or inactivity. Please contact our support team with your registered email and we will review your case within 2 business days.',
    keywords: ['account', 'deactivated', 'blocked', 'disabled'],
    category: 'account', role: 'student', isActive: true,
  },

  // general
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team via the "Help" section in your dashboard, by emailing support@lmsplatform.com, or by using the live chat option available Monday to Saturday, 9 AM – 6 PM.',
    keywords: ['contact', 'support', 'help', 'reach'],
    category: 'general', role: 'student', isActive: true,
  },
  {
    question: 'What are the platform working hours?',
    answer: 'The platform is available 24/7 for self-paced learning. The support team is available Monday to Saturday, 9 AM – 6 PM IST. Response time for email queries is within 24 hours.',
    keywords: ['working hours', 'available', 'timing', 'support hours'],
    category: 'general', role: 'student', isActive: true,
  },
  {
    question: 'I have a technical issue not covered here.',
    answer: 'Please describe your issue in detail and contact our support team via the "Report a Bug" option in the Help section. Include screenshots if possible so we can resolve it faster.',
    keywords: ['technical', 'issue', 'problem', 'bug'],
    category: 'general', role: 'student', isActive: true,
  },

  // ── TEACHER ──────────────────────────────────────────────────────────────

  // course_management
  {
    question: 'How do I create a new course?',
    answer: "Go to Programs & Courses in your dashboard and click 'Add New Course'. Fill in the course name, code, and description, then save. The course may require admin approval before it becomes visible.",
    keywords: ['create', 'course', 'new', 'add'],
    category: 'course_management', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I edit course content?',
    answer: "Open the course from Programs & Courses and click 'Edit Course'. You can update the title, description, and other details, then save your changes.",
    keywords: ['edit', 'course', 'update', 'content'],
    category: 'course_management', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I see enrolled students in my course?',
    answer: 'Open your course page and go to the Students or Enrollment section. You will see the full list of students currently enrolled in that course.',
    keywords: ['enrolled', 'students', 'list', 'view'],
    category: 'course_management', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I remove a student from my course?',
    answer: "In the course's enrolled students list, use the remove/unenroll action next to the student's name. If you do not have this permission, request the admin to do it.",
    keywords: ['remove', 'student', 'unenroll'],
    category: 'course_management', role: 'teacher', isActive: true,
  },

  // content_upload
  {
    question: 'How do I upload video tutorials?',
    answer: "Open your course page and click 'Upload New Video'. Choose the video file, give it a clear title, and upload. The video appears in the Video Tutorials section after processing.",
    keywords: ['upload', 'video', 'tutorial'],
    category: 'content_upload', role: 'teacher', isActive: true,
  },
  {
    question: 'What video formats are supported?',
    answer: 'MP4 is the recommended and most widely supported format. Keep file sizes reasonable for smooth streaming. If your file is in another format, convert it to MP4 before uploading.',
    keywords: ['video', 'format', 'mp4', 'supported'],
    category: 'content_upload', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I upload course documents?',
    answer: "On the course page, click 'Upload New File' in the Documentations section. Select your PDF or document file and upload. Students can then view and download it.",
    keywords: ['upload', 'document', 'file', 'pdf'],
    category: 'content_upload', role: 'teacher', isActive: true,
  },
  {
    question: 'My upload is failing, what to do?',
    answer: 'Check your internet connection and the file size first — very large files may time out. Try a smaller file or a different browser. If uploads keep failing, contact the admin.',
    keywords: ['upload', 'failing', 'error', 'stuck'],
    category: 'content_upload', role: 'teacher', isActive: true,
  },

  // quiz_exam
  {
    question: 'How do I create a quiz for my course?',
    answer: "Open your course and go to the Quiz section, then click 'Create Quiz'. Add your questions, set the marks for each, and publish the quiz for students.",
    keywords: ['create', 'quiz', 'make', 'add'],
    category: 'quiz_exam', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I set quiz time limits?',
    answer: 'While creating or editing a quiz, use the time limit / duration setting to define how long students get. Save the quiz after setting the duration.',
    keywords: ['quiz', 'time', 'limit', 'duration'],
    category: 'quiz_exam', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I view student quiz results?',
    answer: "Open the quiz from your course and go to Results or Quiz Progress. You can see each student's score and attempt details there.",
    keywords: ['quiz', 'results', 'scores', 'students'],
    category: 'quiz_exam', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I schedule a lab exam?',
    answer: "Go to the Lab Exams or Exams section, click 'Schedule Exam', choose the course, date, and time, and publish it. Enrolled students will see it in their schedule.",
    keywords: ['schedule', 'lab', 'exam', 'date'],
    category: 'quiz_exam', role: 'teacher', isActive: true,
  },

  // live_class
  {
    question: 'How do I start a live class?',
    answer: "Open your course page and click the 'Start Live Class' button. This opens the live streaming room where students can join you with video and chat.",
    keywords: ['start', 'live', 'class', 'stream'],
    category: 'live_class', role: 'teacher', isActive: true,
  },
  {
    question: 'Students cannot join my live class.',
    answer: 'Make sure the live class is actually running and students are using the correct course page to join. Ask them to refresh and check their internet. If it persists, restart the session.',
    keywords: ['students', 'join', 'live', 'cannot'],
    category: 'live_class', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I share my screen in live class?',
    answer: "Inside the live class room, use the 'Share Screen' control in the toolbar. Select the window or screen you want to present, and students will see it live.",
    keywords: ['share', 'screen', 'live'],
    category: 'live_class', role: 'teacher', isActive: true,
  },

  // teacher_account
  {
    question: 'How do I update my teacher profile?',
    answer: "Go to Profile from the sidebar, click 'Edit', update your information such as name, photo, or qualifications, and save.",
    keywords: ['profile', 'update', 'edit'],
    category: 'teacher_account', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I change my password?',
    answer: "Open Profile or Account Settings, choose 'Change Password', enter your current and new passwords, and save the change.",
    keywords: ['password', 'change', 'reset'],
    category: 'teacher_account', role: 'teacher', isActive: true,
  },
  {
    question: 'How do I contact the admin?',
    answer: "Use the 'Talk to a human' option in this chat to reach the admin, or use the admin contact details provided on the platform. For urgent issues, escalate through this support chat.",
    keywords: ['contact', 'admin', 'help'],
    category: 'teacher_account', role: 'teacher', isActive: true,
  },

  // ── ADMIN ─────────────────────────────────────────────────────────────────

  // user_management
  {
    question: 'How do I add a new teacher account?',
    answer: "Go to the Lecturers section in the Admin Panel and click 'Add New'. Fill in the teacher's details and credentials, assign the teacher role, and save.",
    keywords: ['add', 'teacher', 'account', 'create'],
    category: 'user_management', role: 'admin', isActive: true,
  },
  {
    question: 'How do I deactivate a user account?',
    answer: "Open the user's profile from the Students or Lecturers list and use the 'Deactivate' or 'Block' action. The user will no longer be able to log in until reactivated.",
    keywords: ['deactivate', 'block', 'user', 'disable'],
    category: 'user_management', role: 'admin', isActive: true,
  },
  {
    question: "How do I reset a user's password?",
    answer: "Find the user in the Admin Panel, open their account settings, and use the 'Reset Password' option. Share the temporary password securely or send them a reset link.",
    keywords: ['reset', 'password', 'user'],
    category: 'user_management', role: 'admin', isActive: true,
  },
  {
    question: 'How do I view all registered students?',
    answer: 'Open the Students section from the sidebar. You will see the complete list of registered students with their details, status, and enrollment information.',
    keywords: ['view', 'students', 'list', 'registered'],
    category: 'user_management', role: 'admin', isActive: true,
  },

  // virtual_lab_admin
  {
    question: 'How do I set up a virtual lab environment?',
    answer: 'Go to the Admin Panel → "Virtual Labs" → "Create New Environment." Configure the OS, installed tools, and resource limits, then assign it to the relevant course. Students will be able to launch it from their dashboard once published.',
    keywords: ['setup', 'virtual', 'lab', 'environment', 'create'],
    category: 'virtual_lab_admin', role: 'admin', isActive: true,
  },
  {
    question: 'How do I monitor virtual lab usage?',
    answer: 'Navigate to Admin Panel → "Virtual Labs" → "Usage Reports." You can view active sessions, session duration, resource consumption per student, and export usage logs as CSV.',
    keywords: ['monitor', 'virtual', 'lab', 'usage', 'activity'],
    category: 'virtual_lab_admin', role: 'admin', isActive: true,
  },
  {
    question: "How do I reset a student's virtual lab session?",
    answer: 'Go to Admin Panel → "Virtual Labs" → "Active Sessions," find the student by name or ID, and click "Terminate Session." The student can then re-launch a fresh lab session from their dashboard.',
    keywords: ['reset', 'virtual', 'lab', 'session', 'student'],
    category: 'virtual_lab_admin', role: 'admin', isActive: true,
  },

  // platform
  {
    question: 'How do I approve a new course?',
    answer: "Go to Programs & Courses in the Admin Panel and open the pending courses list. Review the course details and click 'Approve' to publish it for students.",
    keywords: ['approve', 'course', 'new', 'publish'],
    category: 'platform', role: 'admin', isActive: true,
  },
  {
    question: 'How do I manage site announcements?',
    answer: "Use the News & Events section on the Home page. Click 'Add New Post' to publish an announcement, or edit and delete existing posts from the same section.",
    keywords: ['announcement', 'news', 'post'],
    category: 'platform', role: 'admin', isActive: true,
  },
  {
    question: 'How do I view platform analytics?',
    answer: 'Open the Dashboard from the sidebar. It shows key statistics such as total students, lecturers, website traffic charts, and other activity reports.',
    keywords: ['analytics', 'reports', 'stats'],
    category: 'platform', role: 'admin', isActive: true,
  },
  {
    question: 'How do I backup the database?',
    answer: 'Database backups should be taken regularly using your database tools or hosting panel. Coordinate with the technical team for the backup schedule and restore process.',
    keywords: ['backup', 'database', 'data'],
    category: 'platform', role: 'admin', isActive: true,
  },

  // admin_account
  {
    question: 'How do I add another admin?',
    answer: 'In the Admin Panel, go to user management, create a new account, and assign it the admin role. Only existing admins can grant admin access.',
    keywords: ['add', 'admin', 'new'],
    category: 'admin_account', role: 'admin', isActive: true,
  },
  {
    question: 'How do I change admin permissions?',
    answer: "Open the admin user's account in the Admin Panel and adjust their role or permission settings. Save the changes and ask the user to re-login.",
    keywords: ['permissions', 'access', 'roles'],
    category: 'admin_account', role: 'admin', isActive: true,
  },
  {
    question: 'How do I view system logs?',
    answer: "System and activity logs are available in the Admin Panel's logs or activity section. Use them to track logins, changes, and unusual activity on the platform.",
    keywords: ['logs', 'system', 'activity'],
    category: 'admin_account', role: 'admin', isActive: true,
  },

];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Faq.deleteMany({});
  await Faq.insertMany(faqs);

  const counts = faqs.reduce((acc, f) => {
    acc[f.role] = (acc[f.role] || 0) + 1;
    return acc;
  }, {});
  console.log(`✅ Seeded ${faqs.length} FAQs total`);
  for (const [role, count] of Object.entries(counts)) {
    console.log(`   ${role}: ${count}`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
