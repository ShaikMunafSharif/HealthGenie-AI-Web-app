import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Flame, ArrowRight, Sparkles, Target, ChevronRight, AlertTriangle } from 'lucide-react';
import { GlassCard, PageTransition, SectionHeader, GlassButton } from '../../components/ui/Components';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const workouts = [
  { name: 'Morning Cardio', duration: '30 min', calories: 250, exercises: 5, level: 'Moderate', color: '#00F5FF', icon: '🏃' },
  { name: 'Upper Body Strength', duration: '45 min', calories: 350, exercises: 8, level: 'Intense', color: '#39FF14', icon: '💪' },
  { name: 'Yoga & Flexibility', duration: '25 min', calories: 120, exercises: 12, level: 'Light', color: '#BF5FFF', icon: '🧘' },
  { name: 'Core Workout', duration: '20 min', calories: 180, exercises: 6, level: 'Moderate', color: '#FFB347', icon: '🔥' },
  { name: 'Evening Walk', duration: '40 min', calories: 200, exercises: 1, level: 'Light', color: '#00F5FF', icon: '🚶' },
  { name: 'HIIT Session', duration: '25 min', calories: 400, exercises: 10, level: 'Intense', color: '#FF6B35', icon: '⚡' },
];

export default function ExerciseRecommendations() {
  const navigate = useNavigate();

  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking');
  const [stillThinking, setStillThinking] = useState(false);

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    setStillThinking(false);
    setAiPlan('');

    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setStatus('offline');
      setLoading(false);
      setAiPlan("I'm currently unable to connect to my AI engine. Recommendation: **Morning Cardio + Core** (50 min total • 430 calories • Moderate intensity)");
      return;
    }

    const hasModel = statusCheck.models.some(m => m.startsWith('llama3.1:8b'));
    if (!hasModel) {
      setStatus('model_missing');
      setLoading(false);
      setAiPlan("llama3.1:8b model not found. Run: ollama pull llama3.1:8b");
      return;
    }

    setStatus('ready');
    const prompt = `Give me a short daily personalized workout recommendation. Keep it under 2 sentences. Highlight the workout type, duration, and target calorie burn.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'exercise')) {
        setAiPlan(chunk.full);
        setLoading(false);
      }
    } catch {
      setStatus('offline');
      setAiPlan("I'm currently unable to connect to my AI engine. Recommendation: **Morning Cardio + Core** (50 min total • 430 calories • Moderate intensity)");
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="FITNESS" title="Exercise Recommendations" subtitle="AI-generated workout plans tailored for you" />
        <GlassCard className="p-5" style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Sparkles size={24} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600 }}>AI Daily Exercise Recommendation</h3>
          </div>

          {status === 'offline' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>AI service offline. Showing default workout recommendation.</span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchWorkoutPlan}>Retry</GlassButton>
            </div>
          )}

          {status === 'model_missing' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>llama3.1:8b model not found. Run: <code>ollama pull llama3.1:8b</code></span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchWorkoutPlan}>Retry</GlassButton>
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
              {aiPlan}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <GlassButton variant="primary" onClick={() => navigate('/exercise/details')}>Start Workout <ArrowRight size={16} /></GlassButton>
          </div>
        </GlassCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {workouts.map((w, i) => (
            <motion.div key={w.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5" onClick={() => navigate('/exercise/details')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${w.color}12`, border: `1px solid ${w.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {w.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{w.name}</h3>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6, background: `${w.color}15`, color: w.color, border: `1px solid ${w.color}30` }}>{w.level}</span>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} style={{ color: 'var(--text-secondary)' }} /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{w.duration}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={14} style={{ color: 'var(--neon-warn)' }} /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{w.calories} cal</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Target size={14} style={{ color: 'var(--neon-pulse)' }} /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{w.exercises} exercises</span></div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <GlassButton style={{ marginTop: 20 }} onClick={() => navigate('/exercise/pain-relief')}>🎯 Pain Relief Exercises</GlassButton>
      </div>
    </PageTransition>
  );
}
