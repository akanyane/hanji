interface ProgressBarProps {
  value: number
  max: number
  label: string
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const safeMax = Math.max(max, 1)
  const clamped = Math.min(Math.max(value, 0), safeMax)
  const percent = (clamped / safeMax) * 100

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
    >
      <div
        className="h-full rounded-full bg-sky-600 transition-[width] duration-300 dark:bg-sky-400"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
