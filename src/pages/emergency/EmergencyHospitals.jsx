import React from 'react';
import { ArrowLeft, MapPin, Phone, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';

const hospitals = [
  { name: 'City General Hospital', distance: '0.8 km', time: '5 min', rating: 4.5, is24hr: true, phone: '555-0100', type: 'General' },
  { name: 'St. Mary Medical Center', distance: '1.5 km', time: '10 min', rating: 4.8, is24hr: true, phone: '555-0200', type: 'Multi-specialty' },
  { name: 'Unity Health Clinic', distance: '2.1 km', time: '12 min', rating: 4.3, is24hr: false, phone: '555-0300', type: 'Clinic' },
  { name: 'Regional Trauma Center', distance: '3.0 km', time: '15 min', rating: 4.9, is24hr: true, phone: '555-0400', type: 'Trauma' },
  { name: 'Children\'s Hospital', distance: '3.5 km', time: '18 min', rating: 4.7, is24hr: true, phone: '555-0500', type: 'Pediatric' },
];

export default function EmergencyHospitals() {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="theme-emergency" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="NEARBY" title="Hospitals & Clinics" subtitle="Find the nearest healthcare facility" />

        {/* Map placeholder */}
        <GlassCard className="p-0" style={{ marginBottom: 20, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(4,13,31,0.9), rgba(10,25,60,0.5))' }}>
          <div style={{ textAlign: 'center' }}>
            <MapPin size={40} style={{ color: 'var(--neon-warn)', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Map view • Enable location to find nearby hospitals</p>
            <GlassButton variant="primary" style={{ marginTop: 12 }}>Enable Location</GlassButton>
          </div>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {hospitals.map((h, i) => (
            <motion.div key={h.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} color="var(--neon-warn)" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{h.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{h.type}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{h.distance}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{h.time}</span>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3 }}><Star size={11} color="#FFB347" fill="#FFB347" />{h.rating}</span>
                    {h.is24hr && <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(57,255,20,0.1)', color: '#39FF14', border: '1px solid rgba(57,255,20,0.2)' }}>24HR</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <GlassButton><Phone size={14} /></GlassButton>
                  <GlassButton variant="primary"><MapPin size={14} /> Route</GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}><GlassButton onClick={() => navigate('/emergency')}><ArrowLeft size={16} /> Back</GlassButton></div>
      </div>
    </PageTransition>
  );
}
