import { useState, useEffect } from 'react';

const FAQS_URL = 'http://localhost:5002/api/chat/faqs';

export const CATEGORIES = [
  { key: 'registration', label: 'Registration', emoji: '📝' },
  { key: 'courses',      label: 'Courses',      emoji: '📚' },
  { key: 'lab_exam',     label: 'Lab Exams',    emoji: '🧪' },
  { key: 'payment',      label: 'Payment',      emoji: '💳' },
  { key: 'certificate',  label: 'Certificate',  emoji: '🏆' },
  { key: 'quiz',         label: 'Quiz',         emoji: '📝' },
  { key: 'account',      label: 'Account',      emoji: '🔑' },
  { key: 'general',      label: 'General',      emoji: 'ℹ️' },
];

export function useChat() {
  const [faqs, setFaqs] = useState({});
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);

  useEffect(() => {
    fetch(FAQS_URL)
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
  }, []);

  return { faqs, isLoadingFaqs, CATEGORIES };
}
