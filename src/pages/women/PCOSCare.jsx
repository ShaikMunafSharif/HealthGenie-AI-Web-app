import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader, Chip, GlassButton } from '../../components/ui/Components';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const tips = [
  { title: 'Diet Management', desc: 'Anti-inflammatory diet rich in omega-3 fatty acids, leafy greens, and whole grains can help manage PCOS symptoms.', icon: '🥗' },
  { title: 'Regular Exercise', desc: '30 minutes of moderate exercise 5 days a week helps improve insulin sensitivity and hormone balance.', icon: '🏃‍♀️' },
  { title: 'Stress Management', desc: 'Practice yoga, meditation, or deep breathing. Cortisol can worsen PCOS symptoms.', icon: '🧘' },
  { title: 'Sleep Hygiene', desc: '7-9 hours of quality sleep is crucial for hormone regulation and weight management.', icon: '😴' },
  { title: 'Supplementation', desc: 'Inositol, vitamin D, and chromium may help. Consult your doctor before starting any supplements.', icon: '💊' },
];
const trackerSymptoms = ['Irregular Periods', 'Weight Gain', 'Acne', 'Hair Loss', 'Excess Hair Growth', 'Fatigue', 'Mood Changes', 'Insulin Resistance'];

export default function PCOSCare() {
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking');
  const [stillThinking, setStillThinking] = useState(false);

  const fetchPCOSGuidance = async () => {
    setLoading(true);
    setStillThinking(false);
    setGuidance('');

    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setStatus('offline');
      setLoading(false);
      setGuidance("I'm currently unable to connect to my AI engine. General PCOS advice: Focus on low glycemic index foods, regular aerobic exercise, and maintaining healthy sleep cycles to optimize insulin sensitivity.");
      return;
    }

    const hasModel = statusCheck.models.some(m => m.startsWith('llama3.1:8b'));
    if (!hasModel) {
      setStatus('model_missing');
      setLoading(false);
      setGuidance("llama3.1:8b model not found. Run: ollama pull llama3.1:8b");
      return;
    }

    setStatus('ready');
    const prompt = `Give me a very brief, empathetic tip on managing PCOS symptoms through daily lifestyle habits. Keep it to 2 sentences.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'women')) {
        setGuidance(chunk.full);
        setLoading(false);
      }
    } catch {
      setStatus('offline');
      setGuidance("I'm currently unable to connect to my AI engine. General PCOS advice: Focus on low glycemic index foods, regular aerobic exercise, and maintaining healthy sleep cycles to optimize insulin sensitivity.");
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCOSGuidance();
  }, []);

  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="PCOS MANAGEMENT" title="PCOS Care" subtitle="Personalized management and education" />
        <GlassCard className="p-6" style={{ marginBottom: 20, borderColor: 'rgba(191,95,255,0.3)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} color="var(--neon-fem)" />
            <span className="text-eyebrow" style={{ color: 'var(--neon-fem)' }}>AI-POWERED GUIDANCE</span>
          </div>

          {status === 'offline' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>AI service offline. Please start Ollama to enable AI features.</span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchPCOSGuidance}>Retry</GlassButton>
            </div>
          )}

          {status === 'model_missing' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>llama3.1:8b model not found. Run: <code>ollama pull llama3.1:8b</code></span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchPCOSGuidance}>Retry</GlassButton>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ width: '100%', height: 12 }} />
              <div className="skeleton" style={{ width: '85%', height: 12 }} />
              {stillThinking && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Still thinking...</span>}
            </div>
          ) : (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {guidance}
            </p>
          )}
        </GlassCard>
        <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Management Tips</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 24 }}>
          {tips.map((t, i) => (
            <motion.div key={t.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                  <h4 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{t.title}</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{t.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <GlassCard className="p-6">
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Symptom Tracker</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>Track your PCOS symptoms to identify patterns</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {trackerSymptoms.map(s => <Chip key={s} label={s} variant="fem" />)}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
