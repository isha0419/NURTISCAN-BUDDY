import { motion } from 'framer-motion';
import { Trash2, Flame, Camera, ScanText, PenLine } from 'lucide-react';
import { Card } from '@/components/ui/card';
import RiskBadge from '@/components/RiskBadge';

const SOURCE_ICON = { manual: PenLine, ocr: ScanText, ai: Camera };

export default function FoodCard({ entry, onDelete }) {
  const SourceIcon = SOURCE_ICON[entry.source] || PenLine;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="flex items-center gap-4 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <SourceIcon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{entry.foodName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {entry.nutrients?.calories != null && (
              <span className="flex items-center gap-1">
                <Flame size={12} /> {entry.nutrients.calories} kcal
              </span>
            )}
            {entry.createdAt && (
              <span>{new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            )}
          </div>
        </div>

        <RiskBadge level={entry.riskCategory} className="hidden sm:inline-flex" />

        {onDelete && (
          <button
            onClick={() => onDelete(entry._id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete ${entry.foodName}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </Card>
    </motion.div>
  );
}
