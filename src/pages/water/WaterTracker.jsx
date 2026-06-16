import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus, Target, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard, GlassButton, ProgressRing, PageTransition, SectionHeader, AnimatedCounter } from '../../components/ui/Components';
import { useWaterStore } from '../../store/healthStore';

export default function WaterTracker() {
  const { currentIntake, dailyGoal, intakeLog, history, streak, addIntake, setDailyGoal } = useWaterStore();
  const pct = Math.min(100, (currentIntake / dailyGoal) * 100);
  const remaining = Math.max(0, dailyGoal - currentIntake);

  const chartData = history.slice(-7).map((h, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
    intake: h.intake,
    goal: h.goal,
  }));

  if (chartData.length === 0) {
    for (let i = 0; i < 7; i++) {
      chartData.push({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], intake: 1000 + Math.random() * 1500, goal: dailyGoal });
    }
  }

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="HYDRATION" title="Water Tracker" subtitle="Stay hydrated throughout the day" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Water Bottle Visualization */}
          <GlassCard className="p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 120, height: 240, marginBottom: 20 }}>
              {/* Bottle shape */}
              <svg viewBox="0 0 120 240" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.3" />
                  </linearGradient>
                  <clipPath id="bottleClip">
                    <rect x="25" y="40" width="70" height="180" rx="12" />
                  </clipPath>
                </defs>
                {/* Bottle outline */}
                <rect x="40" y="10" width="40" height="25" rx="6" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="2" />
                <rect x="25" y="40" width="70" height="180" rx="12" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="2" />
                {/* Water fill */}
                <motion.rect
                  clipPath="url(#bottleClip)"
                  x="25"
                  initial={{ y: 220, height: 0 }}
                  animate={{ y: 220 - (pct * 1.8), height: pct * 1.8 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  width="70"
                  fill="url(#waterGrad)"
                />
                {/* Wave animation */}
                <motion.path
                  clipPath="url(#bottleClip)"
                  d={`M 25 ${220 - pct * 1.8} Q 45 ${215 - pct * 1.8} 60 ${220 - pct * 1.8} T 95 ${220 - pct * 1.8}`}
                  fill="none"
                  stroke="rgba(0,245,255,0.5)"
                  strokeWidth="2"
                  animate={{ d: [
                    `M 25 ${220 - pct * 1.8} Q 45 ${215 - pct * 1.8} 60 ${220 - pct * 1.8} T 95 ${220 - pct * 1.8}`,
                    `M 25 ${220 - pct * 1.8} Q 45 ${225 - pct * 1.8} 60 ${220 - pct * 1.8} T 95 ${220 - pct * 1.8}`,
                    `M 25 ${220 - pct * 1.8} Q 45 ${215 - pct * 1.8} 60 ${220 - pct * 1.8} T 95 ${220 - pct * 1.8}`,
                  ]}}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Percentage */}
                <text x="60" y="140" textAnchor="middle" fill="var(--text-primary)" fontFamily="JetBrains Mono" fontSize="20" fontWeight="600">
                  {Math.round(pct)}%
                </text>
              </svg>
            </div>

            <div className="font-data" style={{ fontSize: '2rem', color: 'var(--neon-pulse)' }}>
              <AnimatedCounter value={currentIntake} suffix=" ml" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
              of {dailyGoal} ml goal • {remaining} ml remaining
            </p>

            {/* Quick Add Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {[150, 250, 500].map(ml => (
                <motion.button key={ml} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => addIntake(ml)}
                  className="glass-btn"
                  style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
                  <Plus size={14} /> {ml}ml
                </motion.button>
              ))}
            </div>
          </GlassCard>

          {/* Stats & Goal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GlassCard className="p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Target size={18} color="var(--neon-pulse)" />
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Daily Goal</h3>
              </div>
              <ProgressRing value={currentIntake} max={dailyGoal} size={100} strokeWidth={8}>
                <span className="font-data" style={{ fontSize: '0.9rem', color: 'var(--neon-pulse)' }}>{Math.round(pct)}%</span>
              </ProgressRing>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDailyGoal(Math.max(500, dailyGoal - 250))}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(10,25,60,0.4)', border: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={14} />
                </motion.button>
                <span className="font-data" style={{ fontSize: '1rem' }}>{dailyGoal} ml</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDailyGoal(dailyGoal + 250)}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(10,25,60,0.4)', border: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={14} />
                </motion.button>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Award size={18} color="var(--neon-health)" />
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Streak</h3>
              </div>
              <div className="font-data" style={{ fontSize: '2.5rem', color: 'var(--neon-health)' }}>{streak}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>consecutive days</p>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Today's Log</h3>
              {intakeLog.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No intake logged yet today</p>
              ) : (
                <div style={{ maxHeight: 120, overflowY: 'auto' }}>
                  {intakeLog.slice().reverse().map((entry, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--glass-border)' }}>
                      <span className="font-data" style={{ fontSize: '0.8rem', color: 'var(--neon-pulse)' }}>{entry.amount} ml</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(entry.time).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* History Chart */}
        <GlassCard className="p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={18} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Weekly History</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(4,13,31,0.95)', border: '1px solid var(--glass-border)', borderRadius: 12 }} />
              <Bar dataKey="intake" fill="#00F5FF" radius={[6, 6, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
