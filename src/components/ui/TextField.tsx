import { type InputHTMLAttributes, useId } from 'react'
import { cn } from '../../lib/cn'

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  /** Optional helper text shown under the input. */
  hint?: string
}

/** Labeled text input. Autocorrect/capitalization are off, which matters for Korean and romanization. */
export function TextField({
  label,
  value,
  onChange,
  hint,
  className,
  ...props
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-describedby={hint ? hintId : undefined}
        className={cn(
          'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-lg text-slate-900 placeholder:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-400',
          className,
        )}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-sm text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  )
}
