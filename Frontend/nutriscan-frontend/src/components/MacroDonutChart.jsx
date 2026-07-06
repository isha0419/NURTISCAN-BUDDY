import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#1fb56a', '#f59e0b', '#38bdf8'];

export default function MacroDonutChart({ protein = 0, carbs = 0, fats = 0 }) {
  const data = [
    { name: 'Protein', value: protein },
    { name: 'Carbs', value: carbs },
    { name: 'Fats', value: fats },
  ];
  const total = protein + carbs + fats;

  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="65%"
            outerRadius="90%"
            paddingAngle={4}
            cornerRadius={8}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              fontSize: '0.8rem',
            }}
            formatter={(value, name) => [`${value}g`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-2xl font-bold">{total}g</span>
        <span className="text-xs text-muted-foreground">total macros</span>
      </div>
      <div className="mt-2 flex justify-center gap-4 text-xs">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
            <span className="text-muted-foreground">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
