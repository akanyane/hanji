import type { ButtonHTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  // Sumi-ink button; on hover a vermilion "seal" shadow slides out under it.
  primary:
    'bg-ink-900 text-ink-50 shadow-[0_0_0_0_var(--color-seal-500)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--color-seal-500)] dark:bg-ink-50 dark:text-ink-900',
  secondary:
    'border border-ink-900/80 bg-transparent text-ink-900 hover:bg-ink-900 hover:text-ink-50 dark:border-ink-200/70 dark:text-ink-50 dark:hover:bg-ink-50 dark:hover:text-ink-900',
  ghost:
    'text-ink-700 hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-ink-50/10',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 font-medium transition-all duration-200 active:translate-x-0 active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
