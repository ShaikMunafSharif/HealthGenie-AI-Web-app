import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Target, Play, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';

const exercises = [
  { name: 'Jumping Jacks', sets: 3, reps: '20 reps', rest: '30s', muscles: ['Full Body'], icon: '🏃' },
  { name: 'Push-ups', sets: 3, reps: '12 reps', rest: '45s', muscles: ['Chest', 'Triceps'], icon: '💪' },
  { name: 'Squats', sets: 4, reps: '15 reps', rest: '45s', muscles: ['Quads', 'Glutes'], icon: '🦵' },
  { name: 'Plank', sets: 3, reps: '45 sec', rest: '30s', muscles: ['Core'], icon: '🧘' },
  { name: 'Lunges', sets: 3, reps: '12 each', rest: '30s', muscles: ['Legs', 'Glutes'], icon: '🏋️' },
  { name: 'Burpees', sets: 3, reps: '10 reps', rest: '60s', muscles: ['Full Body'], icon: '⚡' },
];

export default function ExerciseDetails() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader eyebrow="WORKOUT" title="Morning Cardio" subtitle="30 min • 250 calories • 6 exercises" />
        <GlassCard className="p-5" style={{ marginBottom: 20, display: 'flex', gap: 24 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {[{ icon: Clock, label: '30 min', color: '#00F5FF' }, { icon: Flame, label: '250 cal', color: '#FF6B35' }, { icon: Target, label: '6 exercises', color: '#39FF14' }, { icon: Heart, label: '120-150 bpm', color: '#BF5FFF' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <s.icon size={22} style={{ color: s.color, display: 'block', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {exercises.map((ex, i) => (
            <motion.div key={ex.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-4" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(0,245,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{ex.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{ex.name}</h3>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ex.sets} sets × {ex.reps}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rest: {ex.rest}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {ex.muscles.map(m => (<span key={m} style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(0,245,255,0.08)', color: 'var(--neon-pulse)', border: '1px solid rgba(0,245,255,0.15)' }}>{m}</span>))}
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={16} color="var(--neon-pulse)" />
                </motion.button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <GlassButton onClick={() => navigate('/exercise/recommendations')}><ArrowLeft size={16} /> Back</GlassButton>
          <GlassButton variant="primary" fullWidth><Play size={16} /> Start Workout</GlassButton>
        </div>
      </div>
    </PageTransition>
  );
}
