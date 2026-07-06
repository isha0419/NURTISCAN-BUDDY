import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Ban, Salad, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const CONDITIONS = [
  'Diabetes', 'Hypertension', 'High Cholesterol', 'Heart Disease',
  'Obesity', 'PCOS', 'Thyroid Disorder', 'Kidney Disease', 'None',
];
const ALLERGIES = ['Peanuts', 'Tree Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy', 'Eggs', 'None'];
const PREFERENCES = ['Vegetarian', 'Vegan', 'Low-Sodium', 'Low-Sugar', 'High-Protein', 'Keto'];

const STEPS = [
  { key: 'medicalConditions', title: 'Any medical conditions?', subtitle: 'This shapes every risk assessment we give you.', options: CONDITIONS, icon: HeartPulse },
  { key: 'allergies', title: 'Any allergies?', subtitle: "We'll flag these immediately in every scan.", options: ALLERGIES, icon: Ban },
  { key: 'dietaryPreferences', title: 'Dietary preferences?', subtitle: 'Optional — helps tailor suggestions to your goals.', options: PREFERENCES, icon: Salad },
];

export default function Onboarding() {
  const { updateHealthProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    medicalConditions: [],
    allergies: [],
    dietaryPreferences: [],
  });

  const current = STEPS[step];
  const selected = answers[current.key];

  const toggle = (option) => {
    setAnswers((prev) => {
      const list = prev[current.key];
      const isNone = option === 'None';
      let next;
      if (isNone) {
        next = list.includes('None') ? [] : ['None'];
      } else {
        const withoutNone = list.filter((o) => o !== 'None');
        next = withoutNone.includes(option)
          ? withoutNone.filter((o) => o !== option)
          : [...withoutNone, option];
      }
      return { ...prev, [current.key]: next };
    });
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    try {
      await updateHealthProfile(answers);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <Card className="w-full max-w-lg p-8 sm:p-10">
        {/* progress dots */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <current.icon size={20} />
            </div>
            <h2 className="font-display text-2xl font-bold">{current.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{current.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {current.options.map((option) => (
                <Chip key={option} selected={selected.includes(option)} onClick={() => toggle(option)}>
                  {option}
                </Chip>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0} className={step === 0 ? 'invisible' : ''}>
            <ArrowLeft size={16} /> Back
          </Button>
          <Button onClick={handleNext} disabled={loading}>
            {step === STEPS.length - 1 ? (
              <>
                {loading ? 'Saving…' : 'Finish setup'} <Check size={16} />
              </>
            ) : (
              <>
                Next <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
