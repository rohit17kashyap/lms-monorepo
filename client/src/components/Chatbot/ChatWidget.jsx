import { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const FAQS_URL    = 'http://localhost:5002/api/chat/faqs';
const TICKETS_URL = 'http://localhost:5002/api/tickets';

const CATEGORIES_BY_ROLE = {
  student: [
    { key: 'registration',  label: 'Registration',  emoji: '📝' },
    { key: 'courses',       label: 'Courses',        emoji: '📚' },
    { key: 'lab_exam',      label: 'Lab Exams',      emoji: '🧪' },
    { key: 'virtual_lab',   label: 'Virtual Lab',    emoji: '🖥️' },
    { key: 'certificate',   label: 'Certificate',    emoji: '🏆' },
    { key: 'quiz',          label: 'Quiz',           emoji: '📝' },
    { key: 'account',       label: 'Account',        emoji: '🔑' },
    { key: 'general',       label: 'General',        emoji: 'ℹ️'  },
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

const ROLE_LABEL = { student: 'Student', teacher: 'Teacher', admin: 'Admin' };

let _id = 0;
const mk = (sender, text, chips, chipsLabel, ticketCard) => ({
  id: ++_id,
  sender,
  text,
  chips,
  chipsLabel,
  ticketCard,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

export default function ChatWidget() {
  const params      = new URLSearchParams(window.location.search);
  const startOpen   = params.get('open') === 'true';
  const urlUserId   = params.get('userId')   || 'guest';
  const urlUserName = params.get('userName') || 'User';

  const [isOpen, setIsOpen]                         = useState(startOpen);
  const isIframeMode                                = startOpen;
  const [messages, setMessages]                     = useState([]);
  const [openDropdownId, setOpenDropdownId]         = useState(null);
  const [chatRole, setChatRole]                     = useState('student');
  const [lastCategory, setLastCategory]             = useState('general');
  const [awaitingTicketQuery, setAwaitingTicketQuery] = useState(false);
  const [awaitingReplyFor, setAwaitingReplyFor]     = useState(null);
  const [inputValue, setInputValue]                 = useState('');

  const messagesEndRef          = useRef(null);
  const inputRef                = useRef(null);
  const backToTopicsCallbackRef = useRef(null);

  const isInputActive = awaitingTicketQuery || awaitingReplyFor !== null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isInputActive) inputRef.current?.focus();
  }, [isInputActive]);

  useEffect(() => {
    const msg = mk('bot', 'Hi 👋 Welcome to LMS Support! Who are you?', buildRoleChips(), 'Choose your role');
    setMessages([msg]);
    setOpenDropdownId(msg.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── helpers ──────────────────────────────────────────────────────────────

  function addBotMessageWithTyping(msgObject) {
    const typingId = 'typing-' + Date.now();
    setMessages((prev) => [...prev, { id: typingId, sender: 'bot', typing: true }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(msgObject));
      if (msgObject.chips) setOpenDropdownId(msgObject.id);
    }, 600);
  }

  function buildRoleChips() {
    return [
      { key: 'student', label: 'Student', emoji: '👨‍🎓', onClick: () => selectRole('student') },
      { key: 'teacher', label: 'Teacher', emoji: '👨‍🏫', onClick: () => selectRole('teacher') },
      { key: 'admin',   label: 'Admin',   emoji: '🛡️',  onClick: () => selectRole('admin')   },
    ];
  }

  // ── FAQ flow ──────────────────────────────────────────────────────────────

  async function selectRole(role) {
    setChatRole(role);
    let grouped = {};
    try {
      const res  = await fetch(`${FAQS_URL}?role=${role}`);
      const data = await res.json();
      for (const faq of data.faqs || []) {
        if (!grouped[faq.category]) grouped[faq.category] = [];
        grouped[faq.category].push(faq);
      }
    } catch (_) {}

    const cats     = CATEGORIES_BY_ROLE[role] || [];
    let catChips = cats.map((cat) => ({
      key:     cat.key,
      label:   cat.label,
      emoji:   cat.emoji,
      onClick: () => selectCategory(cat, grouped, role),
    }));

    if (role === 'teacher' || role === 'admin') {
      catChips = [
        { key: 'support-requests', label: 'Support Requests', emoji: '🎫', onClick: () => handleFetchOpenTickets() },
        ...catChips,
      ];
    }

    const userMsg = mk('user', ROLE_LABEL[role]);
    const catMsg  = mk('bot', 'Great! Please choose a topic:', catChips, 'Choose a topic');
    setMessages((prev) => [...prev, userMsg]);
    addBotMessageWithTyping(catMsg);
  }

  function selectCategory(cat, grouped, role) {
    setLastCategory(cat.key);
    const questions     = grouped[cat.key] || [];
    const questionChips = questions.map((faq) => ({
      key:     faq._id,
      label:   faq.question,
      onClick: () => selectQuestion(faq, cat, grouped, role),
    }));

    const userMsg = mk('user', `${cat.emoji} ${cat.label}`);
    const qMsg    = mk('bot', `Common questions about ${cat.label}:`, questionChips, 'Choose a question');
    setMessages((prev) => [...prev, userMsg]);
    addBotMessageWithTyping(qMsg);
  }

  function selectQuestion(faq, cat, grouped, role) {
    const cats = CATEGORIES_BY_ROLE[role] || [];

    const makeTopicsChip = () => ({
      key:   'topics',
      label: 'Topics',
      emoji: '📋',
      onClick: () => {
        const topicsMsg = mk('bot', 'Please choose a topic:', cats.map((c) => ({
          key:     c.key,
          label:   c.label,
          emoji:   c.emoji,
          onClick: () => selectCategory(c, grouped, role),
        })), 'Choose a topic');
        addBotMessageWithTyping(topicsMsg);
      },
    });

    const ansMsg = mk('bot', faq.answer, [
      {
        key:     'another',
        label:   'Ask another question',
        emoji:   '🔄',
        onClick: () => selectCategory(cat, grouped, role),
      },
      makeTopicsChip(),
      {
        key:   'change-role',
        label: 'Change role',
        emoji: '🔁',
        onClick: () => {
          const roleMsg = mk('bot', 'No problem! Who are you?', buildRoleChips(), 'Choose your role');
          addBotMessageWithTyping(roleMsg);
        },
      },
      {
        key:   'still-need-help',
        label: 'Still need help?',
        emoji: '🙋',
        onClick: () => {
          backToTopicsCallbackRef.current = () => {
            const topicsMsg = mk('bot', 'Please choose a topic:', cats.map((c) => ({
              key:     c.key,
              label:   c.label,
              emoji:   c.emoji,
              onClick: () => selectCategory(c, grouped, role),
            })), 'Choose a topic');
            addBotMessageWithTyping(topicsMsg);
          };
          const promptMsg = mk('bot', "No problem! Please type your question and I'll raise a support request for you. 📩");
          addBotMessageWithTyping(promptMsg);
          setAwaitingTicketQuery(true);
        },
      },
    ], 'More options');

    const userMsg = mk('user', faq.question);
    setMessages((prev) => [...prev, userMsg]);
    addBotMessageWithTyping(ansMsg);
  }

  // ── ticket flow — student ────────────────────────────────────────────────

  async function handleShowMyTickets() {
    const typingId = 'typing-' + Date.now();
    setMessages((prev) => [...prev, { id: typingId, sender: 'bot', typing: true }]);
    try {
      const res     = await fetch(`${TICKETS_URL}/mine?userId=${urlUserId}`);
      const data    = await res.json();
      const tickets = data.tickets || [];

      if (tickets.length === 0) {
        const noMsg = mk('bot', "You haven't raised any support requests yet.");
        setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(noMsg));
        return;
      }

      const headerMsg  = mk('bot', 'Here are your support requests:');
      const ticketMsgs = tickets.map((t) =>
        mk('bot', null, null, null, {
          ticketId: t.ticketId,
          query:    t.query,
          status:   t.status,
          reply:    t.reply,
        })
      );
      setMessages((prev) => prev.filter((m) => m.id !== typingId).concat([headerMsg, ...ticketMsgs]));
    } catch (_) {
      const errMsg = mk('bot', 'Sorry, could not fetch your requests. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(errMsg));
    }
  }

  // ── ticket flow — agent ──────────────────────────────────────────────────

  async function handleFetchOpenTickets() {
    const typingId = 'typing-' + Date.now();
    setMessages((prev) => [...prev, { id: typingId, sender: 'bot', typing: true }]);
    try {
      const res     = await fetch(`${TICKETS_URL}/open`);
      const data    = await res.json();
      const tickets = data.tickets || [];

      if (tickets.length === 0) {
        const noMsg = mk('bot', 'No open support requests at the moment. 🎉');
        setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(noMsg));
        return;
      }

      const headerMsg  = mk('bot', `${tickets.length} open support request${tickets.length !== 1 ? 's' : ''}:`);
      const ticketMsgs = tickets.map((t) =>
        mk('bot', null, [
          {
            key:     `reply-${t._id}`,
            label:   'Reply',
            emoji:   '✏️',
            onClick: () => {
              const promptMsg = mk('bot', `Type your reply for ${t.ticketId}:`);
              addBotMessageWithTyping(promptMsg);
              setAwaitingReplyFor({ _id: t._id, ticketId: t.ticketId });
            },
          },
        ], null, {
          ticketId:      t.ticketId,
          requesterRole: t.role,
          userName:      t.userName,
          query:         t.query,
          status:        t.status,
          reply:         t.reply,
        })
      );
      setMessages((prev) => prev.filter((m) => m.id !== typingId).concat([headerMsg, ...ticketMsgs]));
    } catch (_) {
      const errMsg = mk('bot', 'Sorry, could not fetch open requests. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(errMsg));
    }
  }

  // ── input submit (ticket create / agent reply) ────────────────────────────

  async function handleSubmit() {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');

    if (awaitingTicketQuery) {
      setAwaitingTicketQuery(false);
      const typingId = 'typing-' + Date.now();
      setMessages((prev) => [
        ...prev,
        mk('user', text),
        { id: typingId, sender: 'bot', typing: true },
      ]);
      try {
        const res  = await fetch(TICKETS_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            userId:   urlUserId,
            userName: urlUserName,
            role:     chatRole,
            category: lastCategory,
            query:    text,
          }),
        });
        const data       = await res.json();
        const confirmMsg = mk('bot', data.autoReply, [
          { key: 'my-requests', label: 'My Requests',   emoji: '📋', onClick: () => handleShowMyTickets() },
          { key: 'back-topics', label: 'Back to topics', emoji: '🔙', onClick: () => backToTopicsCallbackRef.current?.() },
        ], 'What next?');
        setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(confirmMsg));
        setOpenDropdownId(confirmMsg.id);
      } catch (_) {
        const errMsg = mk('bot', 'Sorry, could not submit your request. Please try again.');
        setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(errMsg));
      }

    } else if (awaitingReplyFor) {
      const { _id, ticketId } = awaitingReplyFor;
      setAwaitingReplyFor(null);
      const typingId = 'typing-' + Date.now();
      setMessages((prev) => [
        ...prev,
        mk('user', text),
        { id: typingId, sender: 'bot', typing: true },
      ]);
      try {
        await fetch(`${TICKETS_URL}/${_id}/reply`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ reply: text, answeredBy: urlUserName }),
        });
        const successMsg = mk('bot', `✅ Reply sent for ${ticketId}. Student will see it in My Requests.`);
        setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(successMsg));
      } catch (_) {
        const errMsg = mk('bot', 'Sorry, could not send the reply. Please try again.');
        setMessages((prev) => prev.filter((m) => m.id !== typingId).concat(errMsg));
      }
    }
  }

  const handleClose = () => {
    if (isIframeMode) {
      window.parent.postMessage('close-chatbot', '*');
    } else {
      setIsOpen(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="chat-widget">
      {!isIframeMode && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle chat">
          {isOpen ? '✕' : '💬'}
        </button>
      )}

      {(isOpen || isIframeMode) && (
        <div className="chat-window" style={isIframeMode ? {
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%', maxHeight: 'none',
          borderRadius: '16px', animation: 'none', boxShadow: 'none',
        } : {}}>

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-title">
              <span className="chat-header-dot" />
              <div>
                <div className="chat-header-name">LMS Support 🤖</div>
                <div className="chat-header-status">Online · Replies instantly</div>
              </div>
            </div>
            <button className="chat-close-btn" onClick={handleClose}>✕</button>
          </div>

          {/* Scrollable chat area */}
          <div className="chat-body">
            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m.id}>

                  {m.typing ? (
                    /* ── typing indicator ── */
                    <div className="msg-row bot">
                      <div className="bot-avatar">🤖</div>
                      <div className="bubble bot typing-bubble">
                        <span className="dot" /><span className="dot" /><span className="dot" />
                      </div>
                    </div>

                  ) : m.ticketCard ? (
                    /* ── ticket card ── */
                    <>
                      <div className="msg-row bot">
                        <div className="bot-avatar">🤖</div>
                        <div className="ticket-card">
                          <div>
                            <span className="ticket-id">{m.ticketCard.ticketId}</span>
                            <span className={`ticket-status ${m.ticketCard.status}`}>{m.ticketCard.status}</span>
                            {m.ticketCard.requesterRole && (
                              <span className="ticket-meta">
                                {m.ticketCard.userName} · {m.ticketCard.requesterRole}
                              </span>
                            )}
                          </div>
                          <div className="ticket-query">Q: {m.ticketCard.query}</div>
                          {m.ticketCard.reply
                            ? <div className="ticket-reply">💬 {m.ticketCard.reply}</div>
                            : <div className="ticket-waiting">⏳ Waiting for reply...</div>
                          }
                        </div>
                      </div>
                      <div className="msg-time bot">{m.time}</div>
                      {m.chips && (
                        <div className="chips-direct">
                          {m.chips.map((c) => (
                            <button key={c.key} className="chip chip-auto" onClick={c.onClick}>
                              {c.emoji ? `${c.emoji} ` : ''}{c.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>

                  ) : (
                    /* ── regular text bubble ── */
                    <>
                      <div className={`msg-row ${m.sender}`}>
                        {m.sender === 'bot' && <div className="bot-avatar">🤖</div>}
                        <div className={`bubble ${m.sender}`}>{m.text}</div>
                      </div>
                      <div className={`msg-time ${m.sender}`}>{m.time}</div>
                      {m.chips && (
                        <div className="chip-dropdown">
                          <button
                            className={`chip-dropdown-toggle ${openDropdownId === m.id ? 'open' : ''}`}
                            onClick={() => setOpenDropdownId(openDropdownId === m.id ? null : m.id)}
                          >
                            <span>{m.chipsLabel || 'Select an option'}</span>
                            <span className="chip-dropdown-chevron">▾</span>
                          </button>
                          <div className={`chip-list ${openDropdownId === m.id ? 'open' : 'closed'}`}>
                            {m.chips.map((c) => (
                              <button
                                key={c.key}
                                className="chip"
                                onClick={() => { c.onClick(); setOpenDropdownId(null); }}
                              >
                                {c.emoji ? `${c.emoji} ` : ''}{c.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bar — enabled only when awaiting text */}
          <div className="chat-input-bar">
            <input
              ref={inputRef}
              type="text"
              className={`chat-input-field${isInputActive ? ' active' : ''}`}
              placeholder={isInputActive ? 'Type your message...' : '💬 Live chat with agent...'}
              disabled={!isInputActive}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              className={`chat-send-btn${isInputActive ? ' active' : ''}`}
              disabled={!isInputActive}
              onClick={handleSubmit}
            >➤</button>
          </div>

        </div>
      )}
    </div>
  );
}
