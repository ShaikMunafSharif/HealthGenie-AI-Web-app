import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader } from '../../components/ui/Components';

const phases = [
  { name: 'Menstrual (Day 1-5)', skin: 'Skin may be dull and dry', tips: ['Use hydrating serums', 'Gentle cleansing', 'Sheet masks for moisture'], icon: '🌙' },
  { name: 'Follicular (Day 6-13)', skin: 'Skin is at its best, glowing', tips: ['Try new products', 'Exfoliate gently', 'Light moisturizer'], icon: '🌸' },
  { name: 'Ovulation (Day 14-16)', skin: 'Oily skin, possible breakouts', tips: ['Oil-free products', 'Clay masks', 'Salicylic acid for acne'], icon: '☀️' },
  { name: 'Luteal (Day 17-28)', skin: 'Sensitive, prone to breakouts', tips: ['Calming ingredients (aloe, chamomile)', 'Avoid harsh products', 'Spot treatment for acne'], icon: '🍂' },
];

export default function SkinCare() {
  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="SKINCARE" title="Hormone-Synced Skincare" subtitle="Skincare recommendations aligned with your menstrual cycle" />
        <GlassCard className="p-5" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, borderColor: 'rgba(191,95,255,0.3)' }}>
          <Sparkles size={24} color="var(--neon-fem)" />
          <div><p style={{ fontSize: '0.9rem' }}>Current phase: <strong style={{ color: 'var(--neon-fem)' }}>Follicular</strong></p><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Your skin is glowing! Great time to try new products.</p></div>
        </GlassCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {phases.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{p.name}</h3>
                </div>
                <p style={{ color: 'var(--neon-fem)', fontSize: '0.8rem', marginBottom: 10 }}>{p.skin}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {p.tips.map(t => (
                    <li key={t} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--neon-fem)' }}>•</span> {t}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
