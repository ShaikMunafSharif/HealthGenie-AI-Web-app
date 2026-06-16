import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const specialists = [
  { type: 'General Practitioner', desc: 'Primary care, routine checkups, general health', icon: '🩺', color: '#00F5FF' },
  { type: 'Cardiologist', desc: 'Heart conditions, blood pressure, chest pain', icon: '❤️', color: '#FF6B35' },
  { type: 'Dermatologist', desc: 'Skin conditions, rashes, acne, moles', icon: '🧴', color: '#BF5FFF' },
  { type: 'Orthopedist', desc: 'Bone & joint issues, fractures, sports injuries', icon: '🦴', color: '#FFB347' },
  { type: 'Gynecologist', desc: "Women's health, reproductive care, pregnancy", icon: '👩‍⚕️', color: '#BF5FFF' },
  { type: 'Neurologist', desc: 'Headaches, seizures, nerve disorders', icon: '🧠', color: '#00F5FF' },
  { type: 'Gastroenterologist', desc: 'Digestive issues, stomach pain, IBS', icon: '🫃', color: '#39FF14' },
  { type: 'Endocrinologist', desc: 'Diabetes, thyroid, hormone disorders', icon: '⚗️', color: '#FFB347' },
  { type: 'Psychiatrist', desc: 'Mental health, anxiety, depression', icon: '🧘', color: '#BF5FFF' },
  { type: 'Pulmonologist', desc: 'Lung & breathing disorders, asthma', icon: '🫁', color: '#00F5FF' },
];

export default function DoctorRecommendation() {
  const navigate = useNavigate();
  const { selectedSymptoms } = useSymptomStore();

  const [aiRec, setAiRec] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking');
  const [stillThinking, setStillThinking] = useState(false);

  const fetchDoctorRecommendations = async () => {
    setLoading(true);
    setStillThinking(false);
    setAiRec('');

    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setStatus('offline');
      setLoading(false);
      setAiRec(`I'm currently unable to connect to my AI engine. Recommendation: Based on your health profile, we suggest scheduling a consultation with a General Practitioner for routine health checkups.`);
      return;
    }

    const hasModel = statusCheck.models.some(m => m.startsWith('llama3.1:8b'));
    if (!hasModel) {
      setStatus('model_missing');
      setLoading(false);
      setAiRec("llama3.1:8b model not found. Run: ollama pull llama3.1:8b");
      return;
    }

    setStatus('ready');
    const prompt = `Based on the user's reported symptoms (${selectedSymptoms.join(', ') || 'general wellness checkup'}), recommend which type of doctor specialist they should see and give a 1-sentence reason why.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'doctor')) {
        setAiRec(chunk.full);
        setLoading(false);
      }
    } catch {
      setStatus('offline');
      setAiRec(`I'm currently unable to connect to my AI engine. Recommendation: Based on your health profile, we suggest scheduling a consultation with a General Practitioner for routine health checkups.`);
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorRecommendations();
  }, [selectedSymptoms]);

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="FIND A DOCTOR" title="Doctor Recommendation" subtitle="AI-suggested specialists based on your health profile" />
        <GlassCard className="p-5" style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Sparkles size={24} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600 }}>AI Doctor Recommendation</h3>
          </div>

          {status === 'offline' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>AI service offline. Showing default recommendation.</span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchDoctorRecommendations}>Retry</GlassButton>
            </div>
          )}

          {status === 'model_missing' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>llama3.1:8b model not found. Run: <code>ollama pull llama3.1:8b</code></span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchDoctorRecommendations}>Retry</GlassButton>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ width: '100%', height: 12 }} />
              <div className="skeleton" style={{ width: '85%', height: 12 }} />
              {stillThinking && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Still thinking...</span>}
            </div>
          ) : (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {aiRec}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <GlassButton variant="primary" onClick={() => navigate('/doctor/specialist')}>View Specialists <ArrowRight size={16} /></GlassButton>
          </div>
        </GlassCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {specialists.map((s, i) => (
            <motion.div key={s.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-5" onClick={() => navigate('/doctor/specialist')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{s.type}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{s.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
