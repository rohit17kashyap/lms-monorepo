import { useState, useEffect } from 'react';

const FAQS_URL = 'http://localhost:5002/api/chat/faqs';

const ROLE_MAP = {
  student:       'student',
  teacher:       'teacher',
  lecturer:      'teacher',
  admin:         'admin',
  administrator: 'admin',
  staff:         'admin',
};

const CATEGORIES_BY_ROLE = {
  student: [
    { key: 'registration', label: 'Registration',  emoji: '📝' },
    { key: 'courses',      label: 'Courses',        emoji: '📚' },
    { key: 'lab_exam',     label: 'Lab Exams',      emoji: '🧪' },
    { key: 'virtual_lab',  label: 'Virtual Lab',    emoji: '🖥️' },
    { key: 'certificate',  label: 'Certificate',    emoji: '🏆' },
    { key: 'quiz',         label: 'Quiz',           emoji: '📝' },
    { key: 'account',      label: 'Account',        emoji: '🔑' },
    { key: 'general',      label: 'General',        emoji: 'ℹ️' },
  ],
  teacher: [
    { key: 'course_management', label: 'Course Management', emoji: '📋' },
    { key: 'content_upload',    label: 'Content Upload',    emoji: '📤' },
    { key: 'quiz_exam',         label: 'Quiz & Exams',      emoji: '📝' },
    { key: 'live_class',        label: 'Live Class',        emoji: '🎥' },
    { key: 'teacher_account',   label: 'Account',           emoji: '🔑' },
  ],
  admin: [
    { key: 'user_management',   label: 'User Management', emoji: '👥' },
    { key: 'virtual_lab_admin', label: 'Virtual Lab',     emoji: '🖥️' },
    { key: 'platform',          label: 'Platform',        emoji: '⚙️' },
    { key: 'admin_account',     label: 'Admin Account',   emoji: '🔐' },
  ],
};

function getNormalizedRole() {
  const params = new URLSearchParams(window.location.search);
  const rawRole = (params.get('role') || 'student').toLowerCase().trim();
  return ROLE_MAP[rawRole] || 'student';
}

export function useChat() {
  const role = getNormalizedRole();
  const [faqs, setFaqs] = useState({});
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);

  useEffect(() => {
    fetch(`${FAQS_URL}?role=${role}`)
      .then((r) => r.json())
      .then((data) => {
        const grouped = {};
        for (const faq of data.faqs || []) {
          if (!grouped[faq.category]) grouped[faq.category] = [];
          grouped[faq.category].push(faq);
        }
        setFaqs(grouped);
      })
      .catch(() => setFaqs({}))
      .finally(() => setIsLoadingFaqs(false));
  }, [role]);

  return { faqs, isLoadingFaqs, CATEGORIES: CATEGORIES_BY_ROLE[role], role };
}
