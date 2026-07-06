import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CONFIG = {
  low: { icon: ShieldCheck, label: 'Low risk', variant: 'low' },
  moderate: { icon: ShieldAlert, label: 'Moderate risk', variant: 'moderate' },
  high: { icon: ShieldX, label: 'High risk', variant: 'high' },
};

export default function RiskBadge({ level, className }) {
  const normalized = (level || '').toLowerCase();
  const cfg = CONFIG[normalized] || { icon: ShieldQuestion, label: 'Unknown', variant: 'muted' };
  const Icon = cfg.icon;

  return (
    <Badge variant={cfg.variant} className={className}>
      <Icon size={13} />
      {cfg.label}
    </Badge>
  );
}
