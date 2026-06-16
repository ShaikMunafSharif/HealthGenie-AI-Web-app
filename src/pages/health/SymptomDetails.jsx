import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock, BarChart2, Repeat, FileText } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader, Chip } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';

const durations = ['Less than a day', '1-3 days', '3-7 days', '1-2 weeks', '2-4 weeks', 'More than a month'];
const frequencies = [
  { id: 'constant', label: 'Constant' },
  { id: 'frequent', label: 'Frequent' },
  { id: 'occasional', label: 'Occasional' },
  { id: 'rare', label: 'Rare' },
];

export default function SymptomDetails() {
  const navigate = useNavigate();
  const { severity, duration, frequency, additionalNotes, setSeverity, setDuration, setFrequency, setAdditionalNotes, selectedSymptoms, selectedBodyParts } = useSymptomStore();

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 700, margin: '0 auto' }}>
        <SectionHeader eyebrow="SYMPTOM ANALYSIS" title="Symptom Details" subtitle="Help us understand your symptoms better" />

        {/* Selected summary */}
        {(selectedSymptoms.length > 0 || selectedBodyParts.length > 0) && (
          <GlassCard className="p-4" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedSymptoms.map(s => <Chip key={s} label={s} active />)}
              {selectedBodyParts.map(s => <Chip key={s} label={s} active variant="danger" />)}
            </div>
          </GlassCard>
        )}

        {/* Duration */}
        <GlassCard className="p-6" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Clock size={18} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Duration</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {durations.map(d => (
              <motion.div key={d} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setDuration(d)}
                style={{
                  padding: '12px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer', fontSize: '0.8rem',
                  background: duration === d ? 'rgba(0,245,255,0.12)' : 'rgba(10,25,60,0.4)',
                  border: `1px solid ${duration === d ? 'var(--neon-pulse)' : 'var(--glass-border)'}`,
                  color: duration === d ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}>
                {d}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Severity Slider */}
        <GlassCard className="p-6" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart2 size={18} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Severity</h3>
            <span className="font-data" style={{ marginLeft: 'auto', fontSize: '1.2rem', color: severity <= 3 ? '#39FF14' : severity <= 6 ? '#FFB347' : '#FF6B35' }}>
              {severity}/10
            </span>
          </div>
          <input
            type="range" min="1" max="10" value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            style={{
              width: '100%', height: 8, borderRadius: 4, appearance: 'none',
              background: `linear-gradient(90deg, #39FF14 0%, #FFB347 50%, #FF6B35 100%)`,
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mild</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Moderate</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Severe</span>
          </div>
        </GlassCard>

        {/* Frequency */}
        <GlassCard className="p-6" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Repeat size={18} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Frequency</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {frequencies.map(f => (
              <motion.div key={f.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setFrequency(f.id)}
                style={{
                  padding: 14, borderRadius: 12, textAlign: 'center', cursor: 'pointer', fontSize: '0.85rem',
                  background: frequency === f.id ? 'rgba(0,245,255,0.12)' : 'rgba(10,25,60,0.4)',
                  border: `1px solid ${frequency === f.id ? 'var(--neon-pulse)' : 'var(--glass-border)'}`,
                  color: frequency === f.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}>
                {f.label}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Additional Notes */}
        <GlassCard className="p-6" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FileText size={18} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Additional Context</h3>
          </div>
          <textarea
            className="glass-input"
            rows={4}
            placeholder="Any additional details about your symptoms..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </GlassCard>

        <div style={{ display: 'flex', gap: 12 }}>
          <GlassButton onClick={() => navigate('/symptoms/select')}><ArrowLeft size={18} /> Back</GlassButton>
          <GlassButton variant="primary" fullWidth onClick={() => navigate('/symptoms/processing')}>
            Analyze Symptoms <ArrowRight size={18} />
          </GlassButton>
        </div>
      </div>
    </PageTransition>
  );
}
