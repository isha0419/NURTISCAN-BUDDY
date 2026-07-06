import { motion } from 'framer-motion';
import { Leaf, ScanLine, LineChart, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const FEATURES = [
  { icon: ScanLine, text: 'Scan any label in seconds' },
  { icon: Sparkles, text: 'AI advice tuned to your health' },
  { icon: LineChart, text: 'Track trends week over week' },
];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2 md:gap-0">
        {/* Left brand panel - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card hidden flex-col justify-between rounded-r-none p-10 md:flex"
        >
          <div>
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Leaf size={22} />
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight">
              Know what you eat,
              <br />
              <span className="text-primary">before you eat it.</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Personalized nutrition intelligence, built around your health conditions.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-foreground/80"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon size={15} />
                </div>
                {f.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-l-none p-8 sm:p-10 md:rounded-l-none"
        >
          <div className="mb-2 flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf size={17} />
            </div>
            <span className="font-display text-lg font-bold">NutriScan Buddy</span>
          </div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
