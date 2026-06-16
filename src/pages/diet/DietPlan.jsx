import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Apple, Clock, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { GlassCard, ProgressRing, PageTransition, SectionHeader, GlassButton } from '../../components/ui/Components';
import { useDietStore } from '../../store/healthStore';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultPlan = {
  Monday: { breakfast: 'Oatmeal with berries & almonds', lunch: 'Grilled chicken salad', dinner: 'Salmon with steamed broccoli', snack: 'Greek yogurt' },
  Tuesday: { breakfast: 'Avocado toast with eggs', lunch: 'Quinoa bowl with vegetables', dinner: 'Turkey stir-fry with brown rice', snack: 'Mixed nuts' },
  Wednesday: { breakfast: 'Smoothie bowl (banana, spinach)', lunch: 'Lentil soup with bread', dinner: 'Grilled fish with sweet potato', snack: 'Apple with peanut butter' },
  Thursday: { breakfast: 'Whole grain pancakes', lunch: 'Mediterranean wrap', dinner: 'Chicken breast with vegetables', snack: 'Protein bar' },
  Friday: { breakfast: 'Egg white omelette', lunch: 'Brown rice & black beans', dinner: 'Lean beef with salad', snack: 'Cottage cheese & fruit' },
  Saturday: { breakfast: 'French toast with fruit', lunch: 'Grilled veggie sandwich', dinner: 'Pasta with tomato sauce', snack: 'Trail mix' },
  Sunday: { breakfast: 'Acai bowl', lunch: 'Chicken Caesar salad', dinner: 'Baked cod with quinoa', snack: 'Dark chocolate & almonds' },
};

export default function DietPlan() {
  const navigate = useNavigate();
  const { calorieTarget, macros } = useDietStore();
  const [activeDay, setActiveDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const todayMeals = defaultPlan[activeDay];

  const [aiTip, setAiTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking');
  const [stillThinking, setStillThinking] = useState(false);

  const fetchDietTip = async () => {
    setLoading(true);
    setStillThinking(false);
    setAiTip('');

    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setStatus('offline');
      setLoading(false);
      setAiTip("I'm currently unable to connect to my AI engine. Tip: Prioritize whole, unprocessed foods and aim for balanced macronutrient ratios.");
      return;
    }

    const hasModel = statusCheck.models.some(m => m.startsWith('llama3.1:8b'));
    if (!hasModel) {
      setStatus('model_missing');
      setLoading(false);
      setAiTip("llama3.1:8b model not found. Run: ollama pull llama3.1:8b");
      return;
    }

    setStatus('ready');
    const prompt = `Give me one highly actionable and unique daily nutrition tip for someone wanting to maintain a balanced diet of ${calorieTarget} kcal. Keep it to 2-3 sentences.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'diet')) {
        setAiTip(chunk.full);
        setLoading(false);
      }
    } catch {
      setStatus('offline');
      setAiTip("I'm currently unable to connect to my AI engine. Tip: Prioritize whole, unprocessed foods and aim for balanced macronutrient ratios.");
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietTip();
  }, []);

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="NUTRITION" title="Diet Plan" subtitle="Your personalized weekly meal plan" />

        {/* Macro Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          <GlassCard className="p-4" style={{ textAlign: 'center' }}>
            <Flame size={22} style={{ color: '#FF6B35', margin: '0 auto 8px', display: 'block' }} />
            <span className="font-data" style={{ fontSize: '1.5rem', color: '#FF6B35' }}>{calorieTarget}</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: 2 }}>CALORIES/DAY</p>
          </GlassCard>
          {[
            { label: 'Protein', value: macros.protein, color: '#00F5FF' },
            { label: 'Carbs', value: macros.carbs, color: '#39FF14' },
            { label: 'Fat', value: macros.fat, color: '#FFB347' },
          ].map(m => (
            <GlassCard key={m.label} className="p-4" style={{ textAlign: 'center' }}>
              <ProgressRing value={m.value} size={60} strokeWidth={5} color={m.color}>
                <span className="font-data" style={{ fontSize: '0.75rem', color: m.color }}>{m.value}%</span>
              </ProgressRing>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: 6, textTransform: 'uppercase' }}>{m.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Day Selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
          {days.map(d => (
            <motion.button key={d} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay(d)}
              style={{
                padding: '10px 18px', borderRadius: 12, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Inter', whiteSpace: 'nowrap',
                background: activeDay === d ? 'rgba(57,255,20,0.12)' : 'rgba(10,25,60,0.4)',
                border: `1px solid ${activeDay === d ? 'var(--neon-health)' : 'var(--glass-border)'}`,
                color: activeDay === d ? 'var(--neon-health)' : 'var(--text-secondary)',
              }}>
              {d.slice(0, 3)}
            </motion.button>
          ))}
        </div>

        {/* Meal Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {Object.entries(todayMeals).map(([meal, desc], i) => (
            <motion.div key={meal} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-5" onClick={() => navigate('/diet/meal-details')} style={{ cursor: 'pointer' }}>
                <div style={{
                  width: '100%', height: 120, borderRadius: 12, marginBottom: 14,
                  background: `linear-gradient(135deg, ${i % 2 === 0 ? 'rgba(57,255,20,0.1)' : 'rgba(0,245,255,0.1)'}, rgba(10,25,60,0.3))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Apple size={40} style={{ color: 'var(--neon-health)', opacity: 0.5 }} />
                </div>
                <p className="text-eyebrow" style={{ marginBottom: 4, color: 'var(--neon-health)' }}>{meal.toUpperCase()}</p>
                <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 8 }}>{desc}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {meal === 'breakfast' ? '7:00 AM' : meal === 'lunch' ? '12:30 PM' : meal === 'dinner' ? '7:00 PM' : '4:00 PM'}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="p-5" style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Sparkles size={24} color="var(--neon-pulse)" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600 }}>AI Nutrition Tip of the Day</h3>
          </div>
          
          {status === 'offline' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>AI service offline. Please start Ollama to enable AI features.</span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchDietTip}>Retry</GlassButton>
            </div>
          )}

          {status === 'model_missing' && (
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.8rem', color: 'var(--neon-warn)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>llama3.1:8b model not found. Run: <code>ollama pull llama3.1:8b</code></span>
              <GlassButton style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={fetchDietTip}>Retry</GlassButton>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ width: '100%', height: 12 }} />
              <div className="skeleton" style={{ width: '80%', height: 12 }} />
              {stillThinking && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Still thinking...</span>}
            </div>
          ) : (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {aiTip}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <GlassButton variant="primary" onClick={() => navigate('/diet/meal-details')}>
              Customize & Swap Meals <ArrowRight size={16} />
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
