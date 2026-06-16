import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, Sparkles, AlertTriangle } from 'lucide-react';
import { GlassCard, PageTransition, SectionHeader, GlassButton } from '../../components/ui/Components';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const cycleData = Array.from({ length: 6 }, (_, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i], length: 26 + Math.floor(Math.random() * 5) }));
const symptomData = [{ symptom: 'Cramps', frequency: 80 }, { symptom: 'Headache', frequency: 45 }, { symptom: 'Bloating', frequency: 65 }, { symptom: 'Fatigue', frequency: 55 }, { symptom: 'Mood Swings', frequency: 70 }];

export default function PeriodInsights() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking');
  const [stillThinking, setStillThinking] = useState(false);

  const fetchCycleInsights = async () => {
    setLoading(true);
    setStillThinking(false);
    setInsights('');

    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setStatus('offline');
      setLoading(false);
      setInsights("I'm currently unable to connect to my AI engine. Here are general period cycle tips: Your cycle appears regular with cramps and mood swings as common symptoms. Consider magnesium-rich foods to help reduce cramping.");
      return;
    }

    const hasModel = statusCheck.models.some(m => m.startsWith('llama3.1:8b'));
    if (!hasModel) {
      setStatus('model_missing');
      setLoading(false);
      setInsights("llama3.1:8b model not found. Run: ollama pull llama3.1:8b");
      return;
    }

    setStatus('ready');
    const prompt = `Based on menstrual cycle logs showing regular cycles (average 28 days) with common symptoms of cramps (80% frequency) and mood swings (70% frequency), provide a brief 2-sentence health tip.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'women')) {
        setInsights(chunk.full);
        setLoading(false);
      }
    } catch {
      setStatus('offline');
      setInsights("I'm currently unable to connect to my AI engine. Here are general period cycle tips: Your cycle appears regular with cramps and mood swings as common symptoms. Consider magnesium-rich foods to help reduce cramping.");
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycleInsights();
  }, []);

  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="ANALYTICS" title="Cycle Insights" subtitle="AI-powered pattern analysis of your menstrual health" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <GlassCard className="p-6">
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Cycle Length Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cycleData}>
                <defs><linearGradient id="cycleGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#BF5FFF" stopOpacity={0.3} /><stop offset="95%" stopColor="#BF5FFF" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[24, 32]} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(4,13,31,0.95)', border: '1px solid var(--glass-border)', borderRadius: 12 }} />
                <Area type="monotone" dataKey="length" stroke="#BF5FFF" fill="url(#cycleGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Symptom Frequency</h3>
            {symptomData.map(s => (
              <div key={s.symptom} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.85rem' }}>{s.symptom}</span>
                  <span className="font-data" style={{ fontSize: '0.8rem', color: 'var(--neon-fem)' }}>{s.frequency}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(191,95,255,0.1)' }}>
                  <div style={{ width: `${s.frequency}%`, height: '100%', borderRadius: 3, background: 'var(--neon-fem)', transition: 'width 1s' }} />
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
        <GlassCard className="p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} color="var(--neon-fem)" />
            <span className="text-eyebrow" style={{ color: 'var(--neon-fem)' }}>AI INSIGHTS</span>
          </div>

          {status === 'offline' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span>AI service offline. Please start Ollama to enable AI features.</span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchCycleInsights}>Retry</GlassButton>
            </div>
          )}

          {status === 'model_missing' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span>llama3.1:8b model not found. Run: <code>ollama pull llama3.1:8b</code></span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchCycleInsights}>Retry</GlassButton>
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
              {insights}
            </p>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
}
