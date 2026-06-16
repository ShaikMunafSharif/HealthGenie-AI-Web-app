import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Droplet } from 'lucide-react';
import { GlassCard, GlassButton, Chip, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const commonAllergies = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Penicillin', 'Aspirin', 'Latex', 'Pollen', 'Dust', 'None'];

export default function SetupAllergies() {
  const navigate = useNavigate();
  const { updateProfile, setSetupComplete } = useAuthStore();
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [customAllergy, setCustomAllergy] = useState('');
  const toggleA = (a) => setAllergies(s => s.includes(a) ? s.filter(i => i !== a) : [...s, a]);

  const addCustom = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies(s => [...s, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleFinish = () => {
    updateProfile({ bloodGroup, allergies });
    setSetupComplete();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 520 }}>
        <GlassCard className="p-8" hover={false}>
          <p className="text-eyebrow" style={{ marginBottom: 4 }}>FINAL STEP</p>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Blood Group & Allergies</h1>

          <div style={{ marginBottom: 24 }}>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
              <Droplet size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--neon-warn)' }} />Blood Group
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {bloodGroups.map(bg => (
                <motion.div key={bg} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setBloodGroup(bg)}
                  style={{
                    padding: '14px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                    background: bloodGroup === bg ? 'rgba(255,107,53,0.15)' : 'rgba(10,25,60,0.4)',
                    border: `1px solid ${bloodGroup === bg ? 'rgba(255,107,53,0.5)' : 'var(--glass-border)'}`,
                    transition: 'all 0.3s',
                  }}>
                  <span className="font-data" style={{ fontSize: '1.1rem', color: bloodGroup === bg ? 'var(--neon-warn)' : 'var(--text-secondary)' }}>{bg}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Allergies</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {commonAllergies.map(a => (<Chip key={a} label={a} active={allergies.includes(a)} onClick={() => toggleA(a)} variant="danger" />))}
              {allergies.filter(a => !commonAllergies.includes(a)).map(a => (
                <Chip key={a} label={a} active removable onRemove={() => toggleA(a)} variant="danger" />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <GlassInput placeholder="Add custom allergy..." value={customAllergy} onChange={e => setCustomAllergy(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()} />
              <GlassButton onClick={addCustom}>Add</GlassButton>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <GlassButton onClick={() => navigate('/setup/medical-history')}><ArrowLeft size={18} /> Back</GlassButton>
            <GlassButton variant="primary" fullWidth onClick={handleFinish}>
              <CheckCircle size={18} /> Complete Setup
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
