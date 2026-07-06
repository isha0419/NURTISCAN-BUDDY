import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { History as HistoryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Chip } from '@/components/ui/chip';
import FoodCard from '@/components/FoodCard';
import { foodApi } from '@/lib/api';

const FILTERS = ['all', 'low', 'moderate', 'high'];

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await foodApi.getEntries();
        setEntries(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((e) => (e.riskCategory || '').toLowerCase() === filter);
  }, [entries, filter]);

  const handleDelete = async (id) => {
    setEntries((prev) => prev.filter((e) => e._id !== id));
    try {
      await foodApi.deleteEntry(id);
    } catch {
      // if it fails, refetch to restore accurate state
      const data = await foodApi.getEntries();
      setEntries(data);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything you've logged, in one place.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Chip>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HistoryIcon size={16} className="text-primary" /> {filtered.length} entries
          </CardTitle>
          <CardDescription>Newest first</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}

          {!loading && filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nothing here yet — go scan a food to build your history.
            </p>
          )}

          <AnimatePresence>
            {!loading && filtered.map((entry) => (
              <FoodCard key={entry._id} entry={entry} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
