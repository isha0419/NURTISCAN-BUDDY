import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ScanLine, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import NutrientRings from '@/components/NutrientRings';
import MacroDonutChart from '@/components/MacroDonutChart';
import WeeklyTrendChart from '@/components/WeeklyTrendChart';
import FoodCard from '@/components/FoodCard';
import { foodApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const GOALS = { calories: 2200, protein: 90, carbs: 260 };
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const today = new Date();

  const todayEntries = useMemo(
    () => entries.filter((e) => e.createdAt && isSameDay(new Date(e.createdAt), today)),
    [entries]
  );

  const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  const todayTotals = useMemo(() => {
  const totals = todayEntries.reduce(
    (acc, e) => {
      acc.calories += e.nutrients?.calories || 0;
      acc.protein += e.nutrients?.protein || 0;
      acc.carbs += e.nutrients?.carbs || 0;
      acc.fats += e.nutrients?.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
  return {
    calories: round(totals.calories),
    protein: round(totals.protein),
    carbs: round(totals.carbs),
    fats: round(totals.fats),
  };
}, [todayEntries]);
  const weeklyData = useMemo(() => {
    const map = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      map.set(d.toDateString(), { day: DAY_LABELS[d.getDay()], calories: 0 });
    }
    entries.forEach((e) => {
      if (!e.createdAt) return;
      const key = new Date(e.createdAt).toDateString();
      if (map.has(key)) {
        map.get(key).calories += e.nutrients?.calories || 0;
      }
    });
    return Array.from(map.values());
  }, [entries]);

  const recentEntries = entries.slice(0, 5);
  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          {firstName ? `Hey, ${firstName} 👋` : 'Welcome back 👋'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's how today's tracking is going.</p>
      </motion.div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/scan">
          <Card className="group flex items-center justify-between p-5 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ScanLine size={20} />
              </div>
              <div>
                <p className="font-semibold">Scan a food</p>
                <p className="text-xs text-muted-foreground">Photo, label, or manual entry</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Card>
        </Link>
        <Link to="/cravings">
          <Card className="group flex items-center justify-between p-5 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-semibold">Craving something?</p>
                <p className="text-xs text-muted-foreground">Get a safer alternative</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Rings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's intake</CardTitle>
            <CardDescription>Calories, protein & carbs vs. your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <NutrientRings
              data={{
                calories: { value: todayTotals.calories, goal: GOALS.calories },
                protein: { value: todayTotals.protein, goal: GOALS.protein },
                carbs: { value: todayTotals.carbs, goal: GOALS.carbs },
              }}
            />
            <div className="mt-4 flex items-center justify-center gap-5 text-xs">
              <Legend color="bg-primary-500" label={`Calories ${todayTotals.calories}/${GOALS.calories}`} />
              <Legend color="bg-amber-400" label={`Protein ${todayTotals.protein}g`} />
              <Legend color="bg-sky-400" label={`Carbs ${todayTotals.carbs}g`} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <Flame size={14} className="text-primary" />
              <span className="tabular font-semibold text-foreground">{todayTotals.calories}</span> kcal logged today
            </div>
          </CardContent>
        </Card>

        {/* Macro donut */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Macros</CardTitle>
          </CardHeader>
          <CardContent>
            <MacroDonutChart protein={todayTotals.protein} carbs={todayTotals.carbs} fats={todayTotals.fats} />
          </CardContent>
        </Card>

        {/* Weekly trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp size={16} className="text-primary" /> Weekly trend
            </CardTitle>
            <CardDescription>Calories logged over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyTrendChart data={weeklyData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent entries */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent scans</CardTitle>
            <CardDescription>Your latest logged foods</CardDescription>
          </div>
          <Link to="/history">
            <Button variant="ghost" size="sm">
              View all <ArrowRight size={14} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}
          {!loading && recentEntries.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No entries yet — scan your first food to get started.
            </p>
          )}
          {!loading &&
            recentEntries.map((entry) => <FoodCard key={entry._id} entry={entry} />)}
        </CardContent>
      </Card>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
