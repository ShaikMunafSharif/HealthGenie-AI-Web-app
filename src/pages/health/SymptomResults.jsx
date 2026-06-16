import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Download, RotateCcw, Stethoscope, AlertCircle } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';

export default function SymptomResults() {
  const navigate = useNavigate();
  const { analysisResult, selectedSymptoms, severity, reset } = useSymptomStore();

  const handleNewAnalysis = () => { reset(); navigate('/symptoms/select'); };

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 800, margin: '0 auto' }}>
        <SectionHeader eyebrow="AI DIAGNOSIS" title="Analysis Results" subtitle="Based on your reported symptoms" />

        {/* Severity indicator */}
        <GlassCard className="p-4" style={{ marginBottom: 20, borderColor: severity >= 7 ? 'rgba(255,107,53,0.4)' : 'var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={22} style={{ color: severity <= 3 ? '#39FF14' : severity <= 6 ? '#FFB347' : '#FF6B35' }} />
            <div>
              <span className="font-data" style={{ color: severity <= 3 ? '#39FF14' : severity <= 6 ? '#FFB347' : '#FF6B35' }}>
                {severity <= 3 ? 'LOW SEVERITY' : severity <= 6 ? 'MODERATE SEVERITY' : 'HIGH SEVERITY'}
              </span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Severity level: {severity}/10
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Results */}
        <GlassCard className="p-6" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Stethoscope size={20} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Assessment</h3>
          </div>
          <div style={{
            color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.92rem',
            whiteSpace: 'pre-wrap',
          }}>
            {analysisResult || 'No analysis available. Please try again.'}
          </div>
        </GlassCard>

        {/* Disclaimer */}
        <GlassCard className="p-4" style={{ marginBottom: 24, background: 'rgba(255,107,53,0.05)', borderColor: 'rgba(255,107,53,0.2)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            This AI analysis is for informational purposes only and does not replace professional medical advice. Please consult a qualified healthcare provider for proper diagnosis and treatment.
          </p>
        </GlassCard>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <GlassButton onClick={handleNewAnalysis}><RotateCcw size={16} /> New Analysis</GlassButton>
          <GlassButton onClick={() => navigate('/doctor/recommendation')}>
            <Stethoscope size={16} /> Find Doctor
          </GlassButton>
          <GlassButton variant="primary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> Dashboard
          </GlassButton>
        </div>
      </div>
    </PageTransition>
  );
}
