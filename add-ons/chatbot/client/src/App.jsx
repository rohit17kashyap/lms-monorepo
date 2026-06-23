import ChatWidget from './components/Chatbot/ChatWidget';

function App() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId') || null;
  const role = params.get('role') || null;

  return (
    <div>
      <ChatWidget userId={userId} role={role} />
    </div>
  );
}

export default App;
