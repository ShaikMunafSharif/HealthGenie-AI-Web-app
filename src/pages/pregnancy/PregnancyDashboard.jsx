import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Baby, Calendar, Apple, Dumbbell, Stethoscope, Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader, ProgressRing } from '../../components/ui/Components';

const babySizes = ['Poppy seed', 'Sesame seed', 'Blueberry', 'Raspberry', 'Olive', 'Lime', 'Lemon', 'Peach', 'Apple', 'Avocado', 'Banana', 'Papaya', 'Mango', 'Eggplant', 'Coconut', 'Cauliflower', 'Butternut Squash', 'Cabbage', 'Pineapple', 'Honeydew', 'Cantaloupe', 'Lettuce', 'Napa Cabbage', 'Corn', 'Cucumber', 'Cauliflower', 'Romaine', 'Squash', 'Coconut', 'Honeydew', 'Cantaloupe', 'Pumpkin', 'Pineapple', 'Butternut', 'Honeydew', 'Jackfruit', 'Pumpkin', 'Watermelon', 'Winter Melon', 'Watermelon'];
const weekEmoji = ['🫘', '🫘', '🫐', '🫐', '🍓', '🍋', '🍋', '🍑', '🍎', '🥑', '🍌', '🥭', '🥭', '🍆', '🥥', '🥦', '🎃', '🥬', '🍍', '🍈', '🍈', '🥬', '🥬', '🌽', '🥒', '🥦', '🥬', '🎃', '🥥', '🍈', '🍈', '🎃', '🍍', '🎃', '🍈', '🍈', '🎃', '🍉', '🍉', '🍉'];

const modules = [
  { path: '/pregnancy/trimester', icon: Calendar, label: 'Trimester Overview', desc: 'Your pregnancy journey', icon2: '📅' },
  { path: '/pregnancy/weekly-tips', icon: Sparkles, label: 'Weekly Tips', desc: 'AI personalized guidance', icon2: '💡' },
  { path: '/pregnancy/diet', icon: Apple, label: 'Pregnancy Diet', desc: 'Trimester nutrition', icon2: '🥗' },
  { path: '/pregnancy/exercise', icon: Dumbbell, label: 'Safe Exercises', desc: 'Pregnancy workouts', icon2: '🧘' },
  { path: '/pregnancy/doctor-visits', icon: Stethoscope, label: 'Doctor Visits', desc: 'Appointment scheduler', icon2: '👩‍⚕️' },
];

export default function PregnancyDashboard() {
  const navigate = useNavigate();
  const week = 16; // demo
  const trimester = week <= 12 ? 1 : week <= 26 ? 2 : 3;
  const progress = (week / 40) * 100;

  return (
    <PageTransition>
      <div className="theme-pregnancy" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="PREGNANCY" title="Your Pregnancy Journey" subtitle="Week by week care and guidance" />

        <GlassCard className="p-6" style={{ marginBottom: 24, borderColor: 'rgba(255,179,71,0.3)', background: 'linear-gradient(135deg, rgba(255,179,71,0.08), rgba(10,25,60,0.6))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <ProgressRing value={week} max={40} size={130} strokeWidth={10} color="var(--neon-preg)">
              <div style={{ textAlign: 'center' }}>
                <span className="font-data" style={{ fontSize: '1.8rem', color: 'var(--neon-preg)' }}>{week}</span>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>WEEKS</p>
              </div>
            </ProgressRing>
            <div style={{ flex: 1 }}>
              <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 6 }}>Week {week}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Trimester {trimester} • {40 - week} weeks to go</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: '2.5rem' }}>{weekEmoji[week - 1] || '🍈'}</span>
                <div>
                  <p style={{ color: 'var(--neon-preg)', fontSize: '0.85rem', fontWeight: 500 }}>Baby is the size of a</p>
                  <p className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{babySizes[week - 1] || 'Avocado'}</p>
                </div>
              </div>
              <GlassButton variant="preg" onClick={() => navigate('/pregnancy/weekly-tips')}>This Week's Tips <ArrowRight size={16} /></GlassButton>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>T1</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>T2</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>T3</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,179,71,0.1)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5 }}
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #FFB347, #FF6B35)' }} />
            </div>
          </div>
        </GlassCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {modules.map((mod, i) => (
            <motion.div key={mod.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5" onClick={() => navigate(mod.path)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{mod.icon2}</span>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{mod.label}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{mod.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
