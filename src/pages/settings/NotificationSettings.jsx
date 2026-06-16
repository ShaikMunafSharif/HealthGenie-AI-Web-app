import React from 'react';
import { Bell, Droplets, Dumbbell, Apple, Pill, Calendar, Stethoscope, BarChart3 } from 'lucide-react';
import { GlassCard, AnimatedToggle, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useNotificationStore } from '../../store/healthStore';

const prefs = [
  { key: 'waterReminder', icon: Droplets, label: 'Water Reminders', desc: 'Hydration reminders every 2 hours', color: '#00F5FF' },
  { key: 'exerciseReminder', icon: Dumbbell, label: 'Exercise Reminders', desc: 'Daily workout notifications', color: '#39FF14' },
  { key: 'mealReminder', icon: Apple, label: 'Meal Reminders', desc: 'Breakfast, lunch & dinner alerts', color: '#39FF14' },
  { key: 'medicationReminder', icon: Pill, label: 'Medication Reminders', desc: 'Never miss your medications', color: '#FFB347' },
  { key: 'periodReminder', icon: Calendar, label: 'Period Reminders', desc: 'Cycle prediction notifications', color: '#BF5FFF' },
  { key: 'appointmentReminder', icon: Stethoscope, label: 'Appointment Reminders', desc: 'Doctor visit alerts', color: '#00F5FF' },
  { key: 'dailySummary', icon: BarChart3, label: 'Daily Summary', desc: 'End-of-day health summary', color: '#00F5FF' },
];

export default function NotificationSettings() {
  const { preferences, togglePreference } = useNotificationStore();
  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 700, margin: '0 auto' }}>
        <SectionHeader eyebrow="SETTINGS" title="Notifications" subtitle="Manage your reminder preferences" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {prefs.map(p => (
            <GlassCard key={p.key} className="p-4" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${p.color}10`, border: `1px solid ${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p.icon size={20} style={{ color: p.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 500 }}>{p.label}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
              <AnimatedToggle active={preferences[p.key]} onToggle={() => togglePreference(p.key)} />
            </GlassCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
