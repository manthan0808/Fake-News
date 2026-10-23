import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { UserLayout } from '../components/layout/UserLayout';
import { getAIResponse } from '../data/mockData/dashboardStats';

const SUGGESTED_PROMPTS = [
  'Why was this article marked misleading?',
  'How is the credibility score calculated?',
  'What does "Likely Fake" mean?',
  'How do you extract claims?',
  'What sources do you check against?',
];

const TypingIndicator = () => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '0.5rem 0' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)',
        animation: 'pulse-glow 1.2s ease infinite', animationDelay: `${i * 0.2}s`
      }} />
    ))}
  </div>
);

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: "Hello! I'm **VerifyAI**, your AI assistant for news verification. I can help you understand analysis results, explain credibility scores, or answer questions about how fake news detection works.\n\n_Stage 1 Demo: I use predefined responses._"
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setTyping(false);
    const response = getAIResponse(text);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response }]);
  };

  const renderText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <UserLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxHeight: 700 }}>
        {/* Header */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '1rem 1.25rem' }}>
          <div style={{ width: 40, height: 40, background: 'var(--gradient-brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Bot size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>VerifyAI Assistant</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Ask me about news analysis, fake news detection, or how the system works</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ background: 'var(--color-real-bg)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--color-real)', padding: '0.2rem 0.7rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600 }}>
              ● Online
            </span>
          </div>
        </div>

        {/* Suggested prompts */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button
              key={i}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
              onClick={() => send(p)}
            >
              <Sparkles size={11} /> {p}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? 'var(--gradient-brand)' : 'rgba(99,102,241,0.1)',
                  border: msg.role === 'ai' ? '1px solid rgba(99,102,241,0.2)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.role === 'user' ? 'white' : 'var(--brand-primary)'
                }}>
                  {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div
                  className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                  dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                />
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                  <Bot size={15} />
                </div>
                <div className="chat-bubble-ai"><TypingIndicator /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem' }}>
            <input
              className="form-input"
              placeholder="Ask about the analysis..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              id="assistant-input"
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={() => send(input)} disabled={!input.trim()} id="assistant-send">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
