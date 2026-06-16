import React from 'react';
import { FileText, Download } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useHealthStore } from '../../store/healthStore';

export default function AnalyticsReport() {
  const { healthScore, categories, dailyStats } = useHealthStore();

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 800, margin: '0 auto' }}>
        <SectionHeader eyebrow="REPORT" title="Health Report" subtitle="Export your comprehensive health summary" />
        <GlassCard className="p-6" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <FileText size={24} color="var(--neon-pulse)" />
            <div><h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Monthly Health Summary</h3><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Generated: {new Date().toLocaleDateString()}</p></div>
          </div>
          
          <div style={{ background: 'rgba(10,25,60,0.4)', borderRadius: 16, padding: 24, border: '1px solid var(--glass-border)' }}>
            <h4 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Overview</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Health Score</span><p className="font-data" style={{ fontSize: '1.5rem', color: 'var(--neon-pulse)' }}>{healthScore}/100</p></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Avg. Steps</span><p className="font-data" style={{ fontSize: '1.5rem', color: 'var(--neon-health)' }}>{dailyStats.steps.toLocaleString()}</p></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Water (today)</span><p className="font-data" style={{ fontSize: '1.5rem', color: '#00F5FF' }}>{dailyStats.water} ml</p></div>
              <div><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Avg. Sleep</span><p className="font-data" style={{ fontSize: '1.5rem', color: '#BF5FFF' }}>{dailyStats.sleep} hrs</p></div>
            </div>
            
            <h4 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, margin: '24px 0 12px' }}>Category Scores</h4>
            {Object.entries(categories).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ textTransform: 'capitalize' }}>{k}</span>
                <span className="font-data" style={{ color: v >= 70 ? 'var(--neon-health)' : 'var(--neon-warn)' }}>{v}/100</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassButton variant="primary"><Download size={16} /> Export as PDF</GlassButton>
      </div>
    </PageTransition>
  );
}
