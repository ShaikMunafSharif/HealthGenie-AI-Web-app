import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Droplets, Dumbbell, Apple, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { GlassCard, GlassButton, ProgressRing, PageTransition, SectionHeader } from '../../components/ui/Components';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const nutritionData = { calories: 450, protein: 35, carbs: 45, fat: 15, fiber: 8, sugar: 12, sodium: 420 };
const recipe = ['Season chicken breast with herbs and olive oil', 'Grill for 6-7 minutes each side', 'Steam broccoli until tender-crisp', 'Serve with lemon wedge and quinoa'];

export default function MealDetails() {
  const navigate = useNavigate();
  const [swappedMeal, setSwappedMeal] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [status, setStatus] = useState('ready');
  const [stillThinking, setStillThinking] = useState(false);

  const handleSwap = async () => {
    setSwapping(true);
    setStillThinking(false);
    setSwappedMeal('');
    
    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setStatus('offline');
      setSwapping(false);
      setSwappedMeal("AI is offline. Recommending a quick swap:\n\n**Grilled Tofu Salad**\n- Calories: 380 kcal\n- Protein: 22g\n- Carbs: 30g\n- Fat: 12g\n\n*Steps:*\n1. Toss mixed greens and cherry tomatoes.\n2. Cubed and pan-sear tofu with soy-sesame glaze.\n3. Drizzle with sesame vinaigrette.");
      return;
    }
    
    const hasModel = statusCheck.models.some(m => m.startsWith('llama3.1:8b'));
    if (!hasModel) {
      setStatus('model_missing');
      setSwapping(false);
      setSwappedMeal("llama3.1:8b model not found. Run: ollama pull llama3.1:8b");
      return;
    }

    setStatus('ready');
    const prompt = `Suggest one healthy alternative to Grilled Chicken Salad (450 kcal, Protein: 35g, Carbs: 45g, Fat: 15g). Provide:\n1. Meal Name\n2. Nutrition breakdown (calories, protein, carbs, fat)\n3. 3-4 simple preparation steps. Keep it brief.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'diet')) {
        setSwappedMeal(chunk.full);
        setSwapping(false);
      }
    } catch {
      setStatus('offline');
      setSwappedMeal("AI is offline. Recommending a quick swap:\n\n**Grilled Tofu Salad**\n- Calories: 380 kcal\n- Protein: 22g\n- Carbs: 30g\n- Fat: 12g\n\n*Steps:*\n1. Toss mixed greens and cherry tomatoes.\n2. Cubed and pan-sear tofu with soy-sesame glaze.\n3. Drizzle with sesame vinaigrette.");
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setSwapping(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader eyebrow="MEAL DETAILS" title="Grilled Chicken Salad" subtitle="Healthy lunch option — 450 kcal" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <GlassCard className="p-6">
            <div style={{ width: '100%', height: 200, borderRadius: 16, background: 'linear-gradient(135deg, rgba(57,255,20,0.08), rgba(0,245,255,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Apple size={60} style={{ color: 'var(--neon-health)', opacity: 0.4 }} />
            </div>
            <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>Recipe</h3>
            {recipe.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <span className="font-data" style={{ color: 'var(--neon-health)', fontSize: '0.8rem', width: 20, flexShrink: 0 }}>{i + 1}.</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{step}</p>
              </div>
            ))}
          </GlassCard>
          <div>
            <GlassCard className="p-6" style={{ marginBottom: 16 }}>
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Nutrition Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
                {[
                  { label: 'Protein', val: nutritionData.protein, unit: 'g', color: '#00F5FF' },
                  { label: 'Carbs', val: nutritionData.carbs, unit: 'g', color: '#39FF14' },
                  { label: 'Fat', val: nutritionData.fat, unit: 'g', color: '#FFB347' },
                ].map(n => (
                  <div key={n.label} style={{ textAlign: 'center' }}>
                    <ProgressRing value={n.val} max={100} size={70} strokeWidth={5} color={n.color}>
                      <span className="font-data" style={{ fontSize: '0.75rem', color: n.color }}>{n.val}{n.unit}</span>
                    </ProgressRing>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4 }}>{n.label}</p>
                  </div>
                ))}
              </div>
              {Object.entries(nutritionData).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{k}</span>
                  <span className="font-data" style={{ fontSize: '0.85rem' }}>{v}{k === 'calories' ? ' kcal' : k === 'sodium' ? ' mg' : ' g'}</span>
                </div>
              ))}
            </GlassCard>
            <GlassCard className="p-5" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Sparkles size={20} color="var(--neon-pulse)" />
                <p style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Want a different meal? AI can suggest alternatives.</p>
                <GlassButton onClick={handleSwap} disabled={swapping}><RefreshCw size={14} /> Swap</GlassButton>
              </div>

              {status === 'offline' && (
                <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.78rem', color: 'var(--neon-warn)' }}>
                  AI service offline. Showing offline suggestion.
                </div>
              )}

              {status === 'model_missing' && (
                <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', fontSize: '0.78rem', color: 'var(--neon-warn)' }}>
                  llama3.1:8b model not found. Showing offline suggestion.
                </div>
              )}

              {swapping && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ width: '100%', height: 12 }} />
                  <div className="skeleton" style={{ width: '75%', height: 12 }} />
                  {stillThinking && <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Still thinking...</span>}
                </div>
              )}

              {!swapping && swappedMeal && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: 14, borderRadius: 12, background: 'rgba(10,25,60,0.5)', border: '1px solid var(--glass-border)',
                    fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6
                  }}>
                  {swappedMeal}
                </motion.div>
              )}
            </GlassCard>
          </div>
        </div>
        <GlassButton onClick={() => navigate('/diet/plan')}><ArrowLeft size={16} /> Back to Plan</GlassButton>
      </div>
    </PageTransition>
  );
}
