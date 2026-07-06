import { motion } from 'framer-motion';

const RING_CONFIG = [
  { key: 'calories', color: 'stroke-primary-500', track: 'stroke-primary-100 dark:stroke-primary-950' },
  { key: 'protein', color: 'stroke-amber-400', track: 'stroke-amber-100 dark:stroke-amber-950/40' },
  { key: 'carbs', color: 'stroke-sky-400', track: 'stroke-sky-100 dark:stroke-sky-950/40' },
];

function Ring({ radius, stroke, progress, colorClass, trackClass, delay }) {
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <>
      <circle
        r={radius}
        cx="0"
        cy="0"
        fill="none"
        strokeWidth={stroke}
        className={trackClass}
        opacity={0.35}
      />
      <motion.circle
        r={radius}
        cx="0"
        cy="0"
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className={colorClass}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - clamped) }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90)"
      />
    </>
  );
}

/**
 * data = { calories: {value, goal}, protein: {value, goal}, carbs: {value, goal} }
 */
export default function NutrientRings({ data, size = 200 }) {
  const rings = [
    { radius: size * 0.42, stroke: size * 0.075, ...RING_CONFIG[0], ...data.calories },
    { radius: size * 0.31, stroke: size * 0.075, ...RING_CONFIG[1], ...data.protein },
    { radius: size * 0.20, stroke: size * 0.075, ...RING_CONFIG[2], ...data.carbs },
  ];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="mx-auto">
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {rings.map((r, i) => (
          <Ring
            key={r.key}
            radius={r.radius}
            stroke={r.stroke}
            progress={r.value / (r.goal || 1)}
            colorClass={r.color}
            trackClass={r.track}
            delay={i * 0.12}
          />
        ))}
      </g>
    </svg>
  );
}
