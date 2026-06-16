import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Zap, Stethoscope, Apple, AlertTriangle } from 'lucide-react';
import { useChatStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';
import { AIMessageBubble } from '../ui/Components';

const quickActions = [
  { label: 'Analyze symptoms', icon: Stethoscope, prompt: 'I want to analyze my symptoms. Can you help me?' },
  { label: 'Plan my meals', icon: Apple, prompt: 'Help me plan healthy meals for today based on a balanced diet.' },
  { label: 'Emergency help', icon: AlertTriangle, prompt: 'I need emergency health guidance. What should I do?' },
  { label: 'Health tips', icon: Zap, prompt: 'Give me 5 personalized health tips for today.' },
];

export function FloatingChat() {
  const { messages, isStreaming, isOpen, addMessage, updateLastBotMessage, setStreaming, toggleChat } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isStreaming) return;
    
    const userMsg = text.trim();
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    addMessage({ role: 'assistant', content: '' });
    setStreaming(true);

    try {
      for await (const chunk of streamHealthGenie(userMsg, 'general')) {
        updateLastBotMessage(chunk.full);
        if (chunk.done) break;
      }
    } catch (err) {
      updateLastBotMessage('Sorry, I encountered an error. Please try again.');
    }
    
    setStreaming(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: 90,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(57, 255, 20, 0.15))',
          border: '1px solid rgba(0, 245, 255, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          boxShadow: '0 4px 24px rgba(0, 245, 255, 0.2)',
        }}
        className="md:bottom-6"
      >
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid var(--neon-pulse)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {isOpen ? <X size={24} color="var(--neon-pulse)" /> : <MessageCircle size={24} color="var(--neon-pulse)" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 24,
              width: 380,
              maxWidth: 'calc(100vw - 48px)',
              height: '50vh',
              maxHeight: 520,
              background: 'rgba(4, 13, 31, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              zIndex: 200,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
            }}
            className="md:bottom-20"
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={20} color="var(--neon-pulse)" />
              </motion.div>
              <div>
                <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>HealthGenie AI</h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Your personal health assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
            }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Sparkles size={40} style={{ color: 'var(--neon-pulse)', opacity: 0.3, margin: '0 auto 12px' }} />
                  <p className="font-display" style={{ fontSize: '0.9rem', marginBottom: 4 }}>How can I help you?</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Ask about symptoms, diet, or health tips</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend(action.prompt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 12px',
                          fontSize: '0.75rem',
                          background: 'rgba(0, 245, 255, 0.08)',
                          border: '1px solid rgba(0, 245, 255, 0.2)',
                          borderRadius: 10,
                          color: 'var(--neon-pulse)',
                          cursor: 'pointer',
                          fontFamily: 'Inter',
                        }}
                      >
                        <action.icon size={14} />
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <AIMessageBubble
                    key={msg.id}
                    content={msg.content}
                    isUser={msg.role === 'user'}
                    isStreaming={isStreaming && msg.role === 'assistant' && msg === messages[messages.length - 1]}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: 8,
            }}>
              <input
                ref={inputRef}
                className="glass-input"
                style={{ borderRadius: 12, padding: '10px 14px', fontSize: '0.85rem' }}
                placeholder="Ask HealthGenie..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isStreaming}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                disabled={isStreaming || !input.trim()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: input.trim() ? 'linear-gradient(135deg, rgba(0,245,255,0.3), rgba(57,255,20,0.2))' : 'rgba(10,25,60,0.4)',
                  border: '1px solid var(--glass-border)',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Send size={16} color={input.trim() ? 'var(--neon-pulse)' : 'var(--text-secondary)'} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingChat;
