import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Calendar, BarChart3, Brain, Sparkles, Apple, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';

const modules = [
  { path: '/women/period-tracker', icon: Calendar, label: 'Period Tracker', desc: 'Track your cycle and predict next period', color: '#BF5FFF', icon2: '🌸' },
  { path: '/women/period-insights', icon: BarChart3, label: 'Cycle Insights', desc: 'AI-powered pattern analysis', color: '#BF5FFF', icon2: '📊' },
  { path: '/women/pcos-care', icon: Heart, label: 'PCOS Care', desc: 'Personalized PCOS management', color: '#BF5FFF', icon2: '💜' },
  { path: '/women/skin-care', icon: Sparkles, label: 'Skin Care', desc: 'Hormone-synced skincare tips', color: '#BF5FFF', icon2: '✨' },
  { path: '/women/diet', icon: Apple, label: "Women's Nutrition", desc: 'Iron, calcium & hormone-aware diet', color: '#BF5FFF', icon2: '🥗' },
];

export default function WomenDashboard() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="WOMEN'S HEALTH" title="Your Wellness Hub" subtitle="Comprehensive care designed for you" />

        <GlassCard className="p-6" style={{ marginBottom: 24, borderColor: 'rgba(191,95,255,0.3)', background: 'linear-gradient(135deg, rgba(191,95,255,0.08), rgba(10,25,60,0.6))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(191,95,255,0.2)', border: '1px solid rgba(191,95,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={28} color="var(--neon-fem)" />
            </motion.div>
            <div style={{ flex: 1 }}>
              <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Cycle Day 14</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ovulation phase • Next period in ~14 days</p>
            </div>
            <GlassButton variant="fem" onClick={() => navigate('/women/period-tracker')}>Track <ArrowRight size={16} /></GlassButton>
          </div>
        </GlassCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {modules.map((mod, i) => (
            <motion.div key={mod.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5" onClick={() => navigate(mod.path)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    {mod.icon2}
                  </div>
                  <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{mod.label}</h3>
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
