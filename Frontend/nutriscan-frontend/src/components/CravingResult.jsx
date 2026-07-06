import { motion } from 'framer-motion';
import { AlertTriangle, Salad } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CravingResult({ result }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <Card className="p-4">
        <div className="flex gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-risk-moderate" />
          <div>
            <p className="text-sm font-semibold">Craving: {result.originalCraving}</p>
            <p className="mt-1 text-sm text-muted-foreground">{result.riskIfEatenDirectly}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {result.alternatives?.map((alt, i) => (
          <motion.div
            key={alt.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Card className="h-full p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Salad size={16} />
              </div>
              <CardTitle className="text-base">{alt.name}</CardTitle>
              <p className="mt-1.5 text-sm text-muted-foreground">{alt.reason}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
