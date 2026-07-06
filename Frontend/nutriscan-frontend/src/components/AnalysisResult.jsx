import { motion } from 'framer-motion';
import { Sparkles, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RiskBadge from '@/components/RiskBadge';

export default function AnalysisResult({ result, foodName, onSave, saving }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary-400 to-primary-200" />
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary">
              <Sparkles size={12} /> AI analysis
            </div>
            <CardTitle>{foodName}</CardTitle>
          </div>
          <RiskBadge level={result.riskCategory} />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground/80">{result.reason}</p>

          {result.suggestion && (
            <div className="flex gap-3 rounded-xl bg-primary/5 p-3.5">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary" />
              <p className="text-sm text-foreground/80">
                <span className="font-semibold text-foreground">Suggestion: </span>
                {result.suggestion}
              </p>
            </div>
          )}

          {onSave && (
            <Button onClick={onSave} disabled={saving} className="w-full">
              {saving ? 'Saving…' : 'Save to log'}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
