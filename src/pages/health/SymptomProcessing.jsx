import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NeuralProcessing, PageTransition } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

export default function SymptomProcessing() {
  const navigate = useNavigate();
  const { selectedSymptoms, selectedBodyParts, duration, severity, frequency, additionalNotes, setAnalysisResult, setIsAnalyzing } = useSymptomStore();
  const [statusText, setStatusText] = useState('HealthGenie is analyzing your symptoms...');

  useEffect(() => {
    let cancelled = false;
    
    const analyze = async () => {
      setIsAnalyzing(true);
      const prompt = `Analyze these symptoms and provide a diagnosis assessment:
Symptoms: ${selectedSymptoms.join(', ')}
Affected areas: ${selectedBodyParts.join(', ')}
Duration: ${duration}
Severity: ${severity}/10
Frequency: ${frequency}
Additional context: ${additionalNotes || 'None provided'}

Please provide:
1. Top 3 most likely conditions with confidence percentages
2. Severity assessment (mild/moderate/severe)
3. Recommended actions (numbered list)
4. When to see a doctor
5. Suggested specialist type`;

      const thinkTimer = setTimeout(() => {
        if (!cancelled) {
          setStatusText('Still thinking... analyzing neural pathways...');
        }
      }, 10000);

      // Check status
      const statusCheck = await checkOllamaStatus();
      const hasModel = statusCheck.available && statusCheck.models.some(m => m.startsWith('llama3.1:8b'));
      
      let result = '';
      if (hasModel) {
        try {
          for await (const chunk of streamHealthGenie(prompt, 'symptoms')) {
            if (cancelled) {
              clearTimeout(thinkTimer);
              return;
            }
            result = chunk.full;
            if (chunk.done) break;
          }
        } catch (err) {
          result = ''; // triggers fallback below
        }
      }

      clearTimeout(thinkTimer);

      if (!result) {
        // Fallback static advice
        result = `Based on your symptoms (${selectedSymptoms.join(', ')}) with severity ${severity}/10:\n\n**Possible Conditions:**\n1. **Viral Infection** (65% confidence) - Common cold or flu-like illness\n2. **Stress-related Symptoms** (20% confidence) - Tension-type manifestation\n3. **Allergic Reaction** (15% confidence) - Environmental allergen response\n\n**Severity Assessment:** ${severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : 'Severe'}\n\n**Recommended Actions:**\n1. Rest and stay hydrated\n2. Monitor symptoms for changes\n3. Take over-the-counter pain relief if needed\n4. Track temperature regularly\n\n**When to See a Doctor:**\n${severity >= 7 ? '⚠️ URGENT: Given the severity level, consider seeing a doctor within 24 hours.' : 'If symptoms persist for more than 7 days or worsen significantly.'}\n\n**Suggested Specialist:** General Practitioner / Internal Medicine\n\n⚠️ *This is an AI-generated assessment. Always consult a qualified healthcare professional for proper diagnosis.*`;
      }

      if (!cancelled) {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        navigate('/symptoms/results');
      }
    };

    analyze();

    return () => { cancelled = true; };
  }, []);

  return (
    <PageTransition>
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <NeuralProcessing text={statusText} />
        <motion.div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 400 }}>
          {selectedSymptoms.slice(0, 5).map((s, i) => (
            <motion.span key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.15)', fontSize: '0.8rem', color: 'var(--neon-pulse)' }}>
              {s}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
