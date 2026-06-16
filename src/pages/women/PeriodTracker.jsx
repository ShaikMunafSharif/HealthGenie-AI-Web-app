import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader, Chip } from '../../components/ui/Components';
import { useWomenStore } from '../../store/healthStore';

const symptoms = ['Cramps', 'Headache', 'Bloating', 'Mood Swings', 'Fatigue', 'Acne', 'Back Pain', 'Cravings'];
const flowLevels = [{ id: 'none', label: 'None', color: 'transparent' }, { id: 'light', label: 'Light', color: 'rgba(191,95,255,0.3)' }, { id: 'medium', label: 'Medium', color: 'rgba(191,95,255,0.6)' }, { id: 'heavy', label: 'Heavy', color: '#BF5FFF' }];

export default function PeriodTracker() {
  const { cycleLength, lastPeriodStart, setLastPeriod, logSymptom } = useWomenStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [flow, setFlow] = useState('none');

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const periodDays = useMemo(() => {
    if (!lastPeriodStart) return new Set();
    const days = new Set();
    const start = new Date(lastPeriodStart);
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.add(d.toISOString().split('T')[0]);
    }
    // Next predicted period
    const nextStart = new Date(start);
    nextStart.setDate(nextStart.getDate() + cycleLength);
    for (let i = 0; i < 5; i++) {
      const d = new Date(nextStart);
      d.setDate(d.getDate() + i);
      days.add(d.toISOString().split('T')[0]);
    }
    return days;
  }, [lastPeriodStart, cycleLength]);

  const ovulationDay = useMemo(() => {
    if (!lastPeriodStart) return null;
    const d = new Date(lastPeriodStart);
    d.setDate(d.getDate() + Math.floor(cycleLength / 2));
    return d.toISOString().split('T')[0];
  }, [lastPeriodStart, cycleLength]);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="CYCLE TRACKING" title="Period Tracker" subtitle="Track your cycle and log symptoms" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Calendar */}
          <GlassCard className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><ChevronLeft size={20} /></motion.button>
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><ChevronRight size={20} /></motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', padding: 4 }}>{d}</span>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                const isPeriod = periodDays.has(dateStr);
                const isOvulation = ovulationDay === dateStr;
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;

                return (
                  <motion.div key={i} whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', cursor: 'pointer', margin: '0 auto',
                      background: isPeriod ? 'rgba(191,95,255,0.3)' : isOvulation ? 'rgba(0,245,255,0.2)' : 'transparent',
                      border: isSelected ? '2px solid var(--neon-fem)' : isToday ? '1px solid var(--neon-pulse)' : '1px solid transparent',
                      color: isPeriod ? '#BF5FFF' : isToday ? 'var(--neon-pulse)' : 'var(--text-primary)',
                      fontWeight: isToday ? 700 : 400,
                    }}>
                    {i + 1}
                  </motion.div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(191,95,255,0.4)' }} /><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Period</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,245,255,0.3)' }} /><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ovulation</span></div>
            </div>

            {!lastPeriodStart && (
              <GlassButton variant="fem" fullWidth style={{ marginTop: 16 }} onClick={() => setLastPeriod(new Date().toISOString())}>
                <Calendar size={16} /> Log Period Start
              </GlassButton>
            )}
          </GlassCard>

          {/* Symptom Log */}
          <div>
            <GlassCard className="p-6" style={{ marginBottom: 16 }}>
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Log Symptoms</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {symptoms.map(s => (
                  <Chip key={s} label={s} variant="fem" active={selectedSymptoms.includes(s)}
                    onClick={() => setSelectedSymptoms(ss => ss.includes(s) ? ss.filter(i => i !== s) : [...ss, s])} />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6" style={{ marginBottom: 16 }}>
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
                <Droplets size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--neon-fem)' }} />Flow Intensity
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {flowLevels.map(f => (
                  <motion.div key={f.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setFlow(f.id)}
                    style={{
                      padding: 12, borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                      background: flow === f.id ? 'rgba(191,95,255,0.12)' : 'rgba(10,25,60,0.4)',
                      border: `1px solid ${flow === f.id ? 'var(--neon-fem)' : 'var(--glass-border)'}`,
                    }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: f.color, border: '1px solid rgba(191,95,255,0.3)', margin: '0 auto 6px' }} />
                    <span style={{ fontSize: '0.75rem', color: flow === f.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5" style={{ textAlign: 'center' }}>
              <p className="text-eyebrow" style={{ marginBottom: 4 }}>CYCLE LENGTH</p>
              <span className="font-data" style={{ fontSize: '2rem', color: 'var(--neon-fem)' }}>{cycleLength}</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>days average</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
