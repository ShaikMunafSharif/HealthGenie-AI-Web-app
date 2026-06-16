import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Droplets, Apple, Dumbbell, Stethoscope, AlertTriangle,
  Heart, Baby, BarChart3, Bell, Footprints, Moon, Flame, Sparkles,
  HeartPulse, ArrowRight, TrendingUp
} from 'lucide-react';
import { GlassCard, ProgressRing, AnimatedCounter, StreakBadge, PageTransition } from '../../components/ui/Components';
import { useHealthStore, useWaterStore, useAuthStore, useStreakStore } from '../../store/healthStore';

const moduleCards = [
  { path: '/symptoms/select', icon: Stethoscope, label: 'Symptom Analysis', desc: 'AI-powered diagnosis', color: '#00F5FF' },
  { path: '/diet/plan', icon: Apple, label: 'Diet Plan', desc: 'Personalized nutrition', color: '#39FF14' },
  { path: '/exercise/recommendations', icon: Dumbbell, label: 'Exercise', desc: 'Custom workouts', color: '#00F5FF' },
  { path: '/water', icon: Droplets, label: 'Water Tracker', desc: 'Stay hydrated', color: '#00F5FF' },
  { path: '/women/dashboard', icon: Heart, label: "Women's Health", desc: 'Period & PCOS care', color: '#BF5FFF' },
  { path: '/pregnancy/dashboard', icon: Baby, label: 'Pregnancy', desc: 'Week-by-week care', color: '#FFB347' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency', desc: 'SOS & hospitals', color: '#FF6B35' },
  { path: '/first-aid', icon: HeartPulse, label: 'First Aid', desc: 'Quick guides', color: '#FF6B35' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { healthScore, categories, dailyStats } = useHealthStore();
  const { currentIntake, dailyGoal } = useWaterStore();
  const user = useAuthStore(s => s.user);
  const { currentStreak } = useStreakStore();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const scoreColor = healthScore >= 80 ? '#39FF14' : healthScore >= 50 ? '#00F5FF' : '#BF5FFF';

  const stats = [
    { icon: Footprints, label: 'Steps', value: dailyStats.steps, target: 10000, suffix: '', color: '#00F5FF' },
    { icon: Droplets, label: 'Water', value: currentIntake, target: dailyGoal, suffix: 'ml', color: '#00F5FF' },
    { icon: Flame, label: 'Calories', value: dailyStats.calories, target: 2000, suffix: 'kcal', color: '#FF6B35' },
    { icon: Moon, label: 'Sleep', value: dailyStats.sleep, target: 8, suffix: 'hrs', color: '#BF5FFF' },
  ];

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ padding: '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>DASHBOARD</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>
            {greeting}, {user?.name || 'there'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Here's your health overview for today
          </p>
        </motion.div>

        {/* Top section: Health Orb + Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Health Orb Card */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" style={{ display: 'flex', alignItems: 'center', gap: 24, minHeight: 180 }}>
              <ProgressRing value={healthScore} size={140} strokeWidth={10} color={scoreColor}>
                <motion.div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, ${scoreColor}, ${scoreColor}44)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  animate={{
                    boxShadow: [`0 0 15px ${scoreColor}40`, `0 0 30px ${scoreColor}70`, `0 0 15px ${scoreColor}40`],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="font-data" style={{ fontSize: '1.6rem', color: '#020510', lineHeight: 1 }}>{healthScore}</span>
                  <span style={{ fontSize: '0.55rem', color: '#020510', fontWeight: 600, opacity: 0.8 }}>SCORE</span>
                </motion.div>
              </ProgressRing>
              <div style={{ flex: 1 }}>
                <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>Health Score</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>
                  {healthScore >= 80 ? 'Excellent! Keep it up!' : healthScore >= 60 ? 'Good, room for improvement' : 'Needs attention'}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <StreakBadge count={currentStreak} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/health-score')}
                  style={{
                    marginTop: 12, background: 'none', border: 'none', color: 'var(--neon-pulse)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontFamily: 'Inter',
                  }}
                >
                  View Details <ArrowRight size={14} />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Greeting */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" style={{ minHeight: 180, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={20} color="var(--neon-pulse)" />
                </motion.div>
                <span className="text-eyebrow">AI INSIGHTS</span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                {healthScore >= 80
                  ? "Great job today! Your health metrics are looking strong. Consider adding an extra glass of water to maintain your hydration streak."
                  : healthScore >= 60
                  ? "You're making good progress! Try to increase your daily step count and drink more water today to boost your score."
                  : "Let's focus on building healthy habits today. Start with a short walk and drink a glass of water. Small steps make big differences!"
                }
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <TrendingUp size={14} style={{ color: 'var(--neon-health)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Based on your recent activity</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Daily Stats Strip */}
        <motion.div variants={itemVariants}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {stats.map((stat, i) => (
              <GlassCard key={stat.label} className="p-4" style={{ textAlign: 'center' }}>
                <stat.icon size={22} style={{ color: stat.color, margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                <div className="font-data" style={{ fontSize: '1.3rem', color: stat.color }}>
                  <AnimatedCounter value={stat.value} />
                </div>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  / {stat.target.toLocaleString()} {stat.suffix}
                </p>
                {/* Mini progress bar */}
                <div style={{ height: 3, borderRadius: 2, background: 'rgba(100,180,255,0.1)', marginTop: 8 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (stat.value / stat.target) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    style={{ height: '100%', borderRadius: 2, background: stat.color }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Module Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Health Modules</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {moduleCards.map((mod, i) => (
              <motion.div
                key={mod.path}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <GlassCard
                  className="p-5"
                  onClick={() => navigate(mod.path)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${mod.color}12`,
                    border: `1px solid ${mod.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <mod.icon size={22} style={{ color: mod.color }} />
                  </div>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>{mod.label}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{mod.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reminders Preview */}
        <motion.div variants={itemVariants} style={{ marginTop: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <GlassCard className="p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Bell size={18} color="var(--neon-pulse)" />
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Upcoming Reminders</h3>
              </div>
              {[
                { time: '12:30 PM', text: 'Drink water', color: '#00F5FF' },
                { time: '1:00 PM', text: 'Lunch time', color: '#39FF14' },
                { time: '3:00 PM', text: 'Stretch break', color: '#BF5FFF' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--glass-border)' : 'none' }}>
                  <span className="font-data" style={{ fontSize: '0.75rem', color: r.color, width: 70 }}>{r.time}</span>
                  <span style={{ fontSize: '0.85rem' }}>{r.text}</span>
                </div>
              ))}
            </GlassCard>

            <GlassCard className="p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <BarChart3 size={18} color="var(--neon-health)" />
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Quick Categories</h3>
              </div>
              {Object.entries(categories).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', width: 70, color: 'var(--text-secondary)' }}>{key}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(100,180,255,0.1)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: 3,
                        background: val >= 80 ? 'var(--neon-health)' : val >= 50 ? 'var(--neon-pulse)' : 'var(--neon-warn)',
                      }}
                    />
                  </div>
                  <span className="font-data" style={{ fontSize: '0.75rem', width: 30, textAlign: 'right' }}>{val}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
