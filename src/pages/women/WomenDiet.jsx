import React from 'react';
import { Apple, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader, ProgressRing } from '../../components/ui/Components';

const nutrients = [
  { name: 'Iron', current: 12, target: 18, unit: 'mg', color: '#FF6B35', foods: ['Spinach', 'Red meat', 'Lentils', 'Chickpeas'] },
  { name: 'Calcium', current: 800, target: 1000, unit: 'mg', color: '#00F5FF', foods: ['Milk', 'Yogurt', 'Broccoli', 'Almonds'] },
  { name: 'Folate', current: 300, target: 400, unit: 'mcg', color: '#39FF14', foods: ['Leafy greens', 'Avocado', 'Oranges', 'Beans'] },
  { name: 'Vitamin D', current: 500, target: 600, unit: 'IU', color: '#FFB347', foods: ['Eggs', 'Fatty fish', 'Fortified milk', 'Sunlight'] },
];

export default function WomenDiet() {
  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="NUTRITION" title="Women's Nutrition Guide" subtitle="Essential nutrients for women's health" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
          {nutrients.map((n, i) => (
            <motion.div key={n.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-5" style={{ textAlign: 'center' }}>
                <ProgressRing value={n.current} max={n.target} size={80} strokeWidth={6} color={n.color}>
                  <span className="font-data" style={{ fontSize: '0.7rem', color: n.color }}>{Math.round(n.current / n.target * 100)}%</span>
                </ProgressRing>
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginTop: 12, marginBottom: 4 }}>{n.name}</h3>
                <p className="font-data" style={{ color: n.color, fontSize: '0.85rem' }}>{n.current}/{n.target} {n.unit}</p>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                  {n.foods.map(f => <span key={f} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: `${n.color}10`, color: n.color, border: `1px solid ${n.color}20` }}>{f}</span>)}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <GlassCard className="p-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><Sparkles size={18} color="var(--neon-fem)" /><span className="text-eyebrow" style={{ color: 'var(--neon-fem)' }}>AI TIPS</span></div>
          <p style={{ lineHeight: 1.7 }}>Your iron intake is below the recommended daily amount. Include more spinach and legumes in your meals, especially during menstruation when iron loss is higher. Pairing iron-rich foods with vitamin C sources (like citrus) improves absorption.</p>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
