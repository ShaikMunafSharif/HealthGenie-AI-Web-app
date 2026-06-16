import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';

const doctors = [
  { name: 'Dr. Sarah Johnson', specialty: 'General Practitioner', rating: 4.8, distance: '0.5 km', available: true, exp: '12 years' },
  { name: 'Dr. Michael Chen', specialty: 'Internal Medicine', rating: 4.9, distance: '1.2 km', available: true, exp: '15 years' },
  { name: 'Dr. Emily Williams', specialty: 'Family Medicine', rating: 4.7, distance: '2.0 km', available: false, exp: '8 years' },
  { name: 'Dr. James Brown', specialty: 'General Practitioner', rating: 4.6, distance: '2.5 km', available: true, exp: '20 years' },
];

export default function DoctorSpecialist() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader eyebrow="SPECIALISTS" title="Available Doctors" subtitle="Book an appointment with a specialist near you" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {doctors.map((doc, i) => (
            <motion.div key={doc.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(57,255,20,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  👨‍⚕️
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{doc.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{doc.specialty} • {doc.exp}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} color="#FFB347" fill="#FFB347" />{doc.rating}</span>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}><MapPin size={12} />{doc.distance}</span>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, color: doc.available ? 'var(--neon-health)' : 'var(--neon-warn)' }}><Clock size={12} />{doc.available ? 'Available' : 'Busy'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <GlassButton><Phone size={14} /></GlassButton>
                  <GlassButton variant="primary">Book</GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}><GlassButton onClick={() => navigate('/doctor/recommendation')}><ArrowLeft size={16} /> Back</GlassButton></div>
      </div>
    </PageTransition>
  );
}
