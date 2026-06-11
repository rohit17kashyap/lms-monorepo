import { useState } from 'react';
import { useChat } from './useChat';
import './ChatWidget.css';

const CATEGORY_COLORS = {
  registration: '#eff6ff',
  courses:      '#f0fdf4',
  lab_exam:     '#fefce8',
  payment:      '#f5f3ff',
  certificate:  '#fffbeb',
  quiz:         '#fff1f2',
  account:      '#f0fdfa',
  general:      '#f8fafc',
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const { faqs, isLoadingFaqs, CATEGORIES } = useChat();

  const openCategory = (catKey) => { setSelectedCategory(catKey); setView('questions'); };
  const openFaq = (faq) => { setSelectedFaq(faq); setView('answer'); };
  const goBack = () => {
    if (view === 'answer') { setView('questions'); setSelectedFaq(null); }
    else if (view === 'questions') { setView('categories'); setSelectedCategory(null); }
  };
  const goHome = () => { setView('categories'); setSelectedCategory(null); setSelectedFaq(null); };
  const handleClose = () => { setIsOpen(false); setView('categories'); setSelectedCategory(null); setSelectedFaq(null); };

  const catMeta = CATEGORIES.find((c) => c.key === selectedCategory);

  return (
    <div className="chat-widget">
      <button className="chat-toggle-btn" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle chat">
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            {view === 'categories' ? (
              <div className="chat-header-title">
                <span className="chat-header-dot" />
                <div>
                  <div className="chat-header-name">LMS Support 🤖</div>
                  <div className="chat-header-status">Online · Replies instantly</div>
                </div>
              </div>
            ) : (
              <button className="chat-back-btn" onClick={goBack}>
                ← {catMeta?.emoji} {catMeta?.label}
              </button>
            )}
            <button className="chat-close-btn" onClick={handleClose}>✕</button>
          </div>

          <div className="chat-body">

            {/* Screen 1 — categories */}
            {view === 'categories' && (
              <>
                <p className="chat-subtitle">Hi 👋 What can I help you with?</p>
                {isLoadingFaqs ? (
                  <div className="skeleton-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="skeleton-card" />
                    ))}
                  </div>
                ) : (
                  <div className="category-menu">
                    {CATEGORIES.map((cat) => (
                      <div className="category-card" key={cat.key} onClick={() => openCategory(cat.key)}>
                        <span className="category-icon-box" style={{ background: CATEGORY_COLORS[cat.key] }}>
                          {cat.emoji}
                        </span>
                        <span className="category-label">{cat.label}</span>
                        <span className="category-arrow">›</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Screen 2 — questions */}
            {view === 'questions' && (
              <>
                <ul className="question-list">
                  {(faqs[selectedCategory] || []).map((faq) => (
                    <li key={faq._id}>
                      <button className="question-item" onClick={() => openFaq(faq)}>
                        <span>{faq.question}</span>
                        <span className="q-arrow">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="nav-footer">
                  <button className="btn-back" onClick={goBack}>← Back</button>
                  <button className="btn-home" onClick={goHome}>⌂ Main Menu</button>
                </div>
              </>
            )}

            {/* Screen 3 — answer */}
            {view === 'answer' && selectedFaq && (
              <div className="answer-container">
                <p className="answer-question">{selectedFaq.question}</p>
                <div className="answer-text">{selectedFaq.answer}</div>
                <div className="nav-footer">
                  <button className="btn-back" onClick={goBack}>← Back</button>
                  <button className="btn-home" onClick={goHome}>⌂ Main Menu</button>
                </div>
              </div>
            )}

          </div>

          <div className="chat-input-bar">
            <input
              type="text"
              className="chat-input-field"
              placeholder="💬 Live chat with agent..."
              disabled
            />
            <button className="chat-send-btn" disabled>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
