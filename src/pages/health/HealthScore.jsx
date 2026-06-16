import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, Award, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { GlassCard, ProgressRing, PageTransition, SectionHeader, GlassButton } from '../../components/ui/Components';
import { useHealthStore } from '../../store/healthStore';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const radarData = [
  { subject: 'Fitness', A: 65 }, { subject: 'Diet', A: 70 }, { subject: 'Sleep', A: 80 },
  { subject: 'Hydration', A: 60 }, { subject: 'Vitals', A: 75 },
];

const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1, score: 55 + Math.floor(Math.random() * 30) + Math.floor(i * 0.5),
}));

export default function HealthScore() {
  const { healthScore, categories, achievements } = useHealthStore();
  const scoreColor = healthScore >= 80 ? '#39FF14' : healthScore >= 50 ? '#00F5FF' : '#BF5FFF';
  const navigate = useNavigate();

  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking'); // checking, offline, model_missing, ready
  const [stillThinking, setStillThinking] = useState(false);

  const fetchAIInsights = async () => {
    setLoading(true);
    setStillThinking(false);
    setInsights('');
    
    // Check status first
    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setStatus('offline');
      setLoading(false);
      setInsights("I'm currently unable to connect to my AI engine. Here are some general health tips:\n\n• Stay hydrated — aim for 8 glasses of water daily\n• Get 7-9 hours of quality sleep\n• Incorporate 30 minutes of moderate exercise daily\n• Eat a balanced diet rich in fruits and vegetables\n• Practice stress management through meditation or deep breathing\n\n⚠️ For specific health concerns, please consult a healthcare professional.");
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
    
    const prompt = `Analyze my health score profile and suggest improvements. My overall health score is ${healthScore}. Detailed categories: ${JSON.stringify(categories)}. Achievements: ${achievements.map(a => a.name).join(', ')}. Provide 3 specific actionable tips and 1 short-term goal.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'healthScore')) {
        setInsights(chunk.full);
        setLoading(false);
      }
    } catch (err) {
      setStatus('offline');
      setInsights("I'm currently unable to connect to my AI engine. Here are some general health tips:\n\n• Stay hydrated — aim for 8 glasses of water daily\n• Get 7-9 hours of quality sleep\n• Incorporate 30 minutes of moderate exercise daily\n• Eat a balanced diet rich in fruits and vegetables\n• Practice stress management through meditation or deep breathing\n\n⚠️ For specific health concerns, please consult a healthcare professional.");
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="ANALYTICS" title="Health Score" subtitle="Your comprehensive health breakdown" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Big Score */}
          <GlassCard className="p-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing value={healthScore} size={200} strokeWidth={12} color={scoreColor}>
              <motion.div
                animate={{ boxShadow: [`0 0 20px ${scoreColor}40`, `0 0 40px ${scoreColor}70`, `0 0 20px ${scoreColor}40`] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 110, height: 110, borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, ${scoreColor}, ${scoreColor}44)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-data" style={{ fontSize: '2.5rem', color: '#020510', lineHeight: 1 }}>{healthScore}</span>
                <span style={{ fontSize: '0.65rem', color: '#020510', fontWeight: 600 }}>/ 100</span>
              </motion.div>
            </ProgressRing>
            <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 16 }}>
              {healthScore >= 80 ? 'Excellent Health' : healthScore >= 60 ? 'Good Health' : 'Needs Improvement'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: 4 }}>
              You're in the top {100 - healthScore}% of HealthGenie users
            </p>
          </GlassCard>

          {/* Radar Chart */}
          <GlassCard className="p-6">
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(100,180,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Score" dataKey="A" stroke="#00F5FF" fill="#00F5FF" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Trend Chart */}
        <GlassCard className="p-6" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={18} color="var(--neon-health)" />
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>30-Day Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(4,13,31,0.95)', border: '1px solid var(--glass-border)', borderRadius: 12, fontFamily: 'Inter' }}
                labelStyle={{ color: 'var(--text-secondary)' }}
              />
              <Area type="monotone" dataKey="score" stroke="#00F5FF" fill="url(#scoreGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Category Detail + Achievements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <GlassCard className="p-6">
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Detailed Breakdown</h3>
            {Object.entries(categories).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>{key}</span>
                  <span className="font-data" style={{ fontSize: '0.85rem', color: val >= 80 ? '#39FF14' : val >= 50 ? '#00F5FF' : '#FF6B35' }}>{val}/100</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'rgba(100,180,255,0.1)' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1 }}
                    style={{ height: '100%', borderRadius: 4, background: val >= 80 ? '#39FF14' : val >= 50 ? '#00F5FF' : '#FF6B35' }} />
                </div>
              </div>
            ))}
          </GlassCard>

          <GlassCard className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Award size={18} color="var(--neon-preg)" />
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Achievements</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {achievements.map((a) => (
                <motion.div key={a.id}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    padding: 16, borderRadius: 14, textAlign: 'center',
                    background: a.unlocked ? 'rgba(0,245,255,0.08)' : 'rgba(10,25,60,0.3)',
                    border: `1px solid ${a.unlocked ? 'rgba(0,245,255,0.2)' : 'var(--glass-border)'}`,
                    opacity: a.unlocked ? 1 : 0.5,
                  }}>
                  <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 4 }}>{a.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{a.name}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* AI Insights */}
        <GlassCard className="p-6" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} color="var(--neon-pulse)" />
            <span className="text-eyebrow">AI-POWERED INSIGHTS</span>
          </div>

          {status === 'offline' && (
            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--neon-warn)' }}>AI service offline. Please start Ollama to enable AI features.</span>
              <GlassButton style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={fetchAIInsights}>Retry</GlassButton>
            </div>
          )}

          {status === 'model_missing' && (
            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--neon-warn)' }}>llama3.1:8b model not found. Run: <code>ollama pull llama3.1:8b</code></span>
              <GlassButton style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={fetchAIInsights}>Retry</GlassButton>
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <div className="skeleton" style={{ width: 150, height: 16 }} />
              </div>
              <div className="skeleton" style={{ width: '100%', height: 12, marginTop: 8 }} />
              <div className="skeleton" style={{ width: '90%', height: 12 }} />
              <div className="skeleton" style={{ width: '75%', height: 12 }} />
              {stillThinking && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: 4 }}>Still thinking...</span>
              )}
            </div>
          )}

          {!loading && (
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.92rem' }}>
              {insights}
            </p>
          )}

          <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/analytics/progress')}
            style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--neon-pulse)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontFamily: 'Inter' }}>
            View Full Analytics <ArrowRight size={14} />
          </motion.button>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
