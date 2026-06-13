import { useState } from 'react';
import { useChat } from './useChat';
import './ChatWidget.css';

const CATEGORY_COLORS = {
  registration:      '#eff6ff',
  courses:           '#f0fdf4',
  lab_exam:          '#fefce8',
  virtual_lab:       '#f0fdf9',
  certificate:       '#fffbeb',
  quiz:              '#fff1f2',
  account:           '#f0fdfa',
  general:           '#f8fafc',
  course_management: '#fef9c3',
  content_upload:    '#eff6ff',
  quiz_exam:         '#fff1f2',
  live_class:        '#fdf2f8',
  teacher_account:   '#f0fdfa',
  user_management:   '#fef2f2',
  virtual_lab_admin: '#f0fdf9',
  platform:          '#f0f4ff',
  admin_account:     '#fdf4ff',
};

export default function ChatWidget() {
  const params = new URLSearchParams(window.location.search)
  const startOpen = params.get('open') === 'true'
  const [isOpen, setIsOpen] = useState(startOpen);
  const isIframeMode = startOpen  // when opened from Django, hide toggle button
  const [view, setView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { faqs, isLoadingFaqs, CATEGORIES, role } = useChat();
  const ROLE_GREETING = { student: 'Student', teacher: 'Lecturer', admin: 'Admin' };
  const greeting = `Hi 👋 Welcome, ${ROLE_GREETING[role] || 'User'}! What can I help you with?`;

  const openCategory = (catKey) => { setSelectedCategory(catKey); setView('questions'); };
  const openFaq = (faq) => { setSelectedFaq(faq); setView('answer'); };
  const goBack = () => {
    if (view === 'answer') { setView('questions'); setSelectedFaq(null); }
    else if (view === 'questions') { setView('categories'); setSelectedCategory(null); setDropdownOpen(false); }
  };
  const goHome = () => { setView('categories'); setSelectedCategory(null); setSelectedFaq(null); setDropdownOpen(false); };
  const handleClose = () => { setIsOpen(false); setView('categories'); setSelectedCategory(null); setSelectedFaq(null); setDropdownOpen(false); };

  const catMeta = CATEGORIES.find((c) => c.key === selectedCategory);

  return (
    <div className="chat-widget">
      {!isIframeMode && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle chat">
          {isOpen ? '✕' : '💬'}
        </button>
      )}

      {(isOpen || isIframeMode) && (
        <div className="chat-window" style={isIframeMode ? {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          width: '100%',
          height: '100%',
          maxHeight: 'none',
          borderRadius: '16px',
          animation: 'none',
          boxShadow: 'none'
        } : {}}>
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
              <div className="categories-screen">
                {isLoadingFaqs ? (
                  <div className="skeleton-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="skeleton-card" />
                    ))}
                  </div>
                ) : (
                  <>
                    <button
                      className={`dropdown-toggle ${dropdownOpen ? 'open' : ''}`}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span>{greeting}</span>
                      <span className="dropdown-chevron">▾</span>
                    </button>
                    <div className={`category-menu ${dropdownOpen ? 'expanded' : 'collapsed'}`}>
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
                  </>
                )}
              </div>
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
