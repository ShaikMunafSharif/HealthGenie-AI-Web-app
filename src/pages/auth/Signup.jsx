import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Ruler, Weight, Calendar } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';
import { mockBackend } from '../../utils/mockBackend';

export default function Signup() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', height: '', weight: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors({}); };

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSignup = async () => {
    setLoading(true);
    const response = await mockBackend.registerUser(form.email, form.password, form.name);
    setLoading(false);

    if (!response.success) {
      alert(response.error);
      return;
    }

    login({ 
      ...response.user,
      age: form.age, 
      gender: form.gender,
      height: form.height,
      weight: form.weight,
    });
    navigate('/onboarding/1');
  };

  const bmi = form.height && form.weight 
    ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) 
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.06), transparent 70%)',
        top: '-10%', left: '-10%',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <GlassCard className="p-8" hover={false}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: s <= step ? 'linear-gradient(90deg, var(--neon-pulse), var(--neon-health))' : 'rgba(100,180,255,0.1)',
                transition: 'all 0.5s',
              }} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <motion.div
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00F5FF, #39FF14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles size={24} color="#020510" />
            </motion.div>
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              {step === 1 ? 'Create Account' : 'Health Basics'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.9rem' }}>
              {step === 1 ? 'Step 1 of 2 — Account details' : 'Step 2 of 2 — Tell us about yourself'}
            </p>
          </div>

          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <GlassInput label="FULL NAME" icon={User} placeholder="Your full name" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
              <GlassInput label="EMAIL" icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
              <div style={{ position: 'relative' }}>
                <GlassInput label="PASSWORD" icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 16, top: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <GlassInput label="CONFIRM PASSWORD" icon={Lock} type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} />
              <GlassButton variant="primary" fullWidth onClick={handleNext}>
                Continue <ArrowRight size={18} />
              </GlassButton>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <GlassInput label="AGE" icon={Calendar} type="number" placeholder="25" value={form.age} onChange={(e) => update('age', e.target.value)} />
                <div>
                  <label className="text-eyebrow" style={{ display: 'block', marginBottom: 8 }}>GENDER</label>
                  <select className="glass-select" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <GlassInput label="HEIGHT (CM)" icon={Ruler} type="number" placeholder="170" value={form.height} onChange={(e) => update('height', e.target.value)} />
                <GlassInput label="WEIGHT (KG)" icon={Weight} type="number" placeholder="70" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
              </div>
              {bmi && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-4"
                  style={{ textAlign: 'center' }}
                >
                  <p className="text-eyebrow" style={{ marginBottom: 4 }}>YOUR BMI</p>
                  <p className="font-data" style={{ fontSize: '2rem', color: bmi < 18.5 ? 'var(--neon-warn)' : bmi < 25 ? 'var(--neon-health)' : bmi < 30 ? 'var(--neon-warn)' : '#FF0040' }}>
                    {bmi}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </motion.div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <GlassButton onClick={() => setStep(1)}>
                  <ArrowLeft size={18} /> Back
                </GlassButton>
                <GlassButton variant="primary" fullWidth onClick={handleSignup} disabled={loading}>
                  {loading ? 'Creating...' : <><ArrowRight size={18} /> Create Account</>}
                </GlassButton>
              </div>
            </motion.div>
          )}

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--neon-pulse)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
