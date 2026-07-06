import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import CravingResult from '@/components/CravingResult';
import { aiApi } from '@/lib/api';

const QUICK_CRAVINGS = ['Chocolate cake', 'Pizza', 'Ice cream', 'Fried chicken', 'Soda', 'Chips'];

export default function Cravings() {
  const [craving, setCraving] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!craving.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await aiApi.getCravingAlternatives(craving.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPick = (item) => {
    setCraving(item);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Craving something?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us what you're craving — we'll suggest options that fit your health profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles size={16} className="text-primary" /> What are you craving?
          </CardTitle>
          <CardDescription>We'll factor in your conditions and allergies automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="e.g. chocolate cake, pizza, fries…"
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !craving.trim()}>
              {loading ? 'Thinking…' : 'Get alternatives'}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {QUICK_CRAVINGS.map((item) => (
              <Chip key={item} selected={craving === item} onClick={() => handleQuickPick(item)}>
                {item}
              </Chip>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && <CravingResult result={result} />}
    </div>
  );
}
