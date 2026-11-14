import { useEffect, useState } from 'react'
import { Button } from './Button'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Clipboard access can be denied (insecure context, permissions).
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={copy}
      disabled={!text}
      className="px-3 py-1 text-sm"
    >
      <span aria-live="polite">{copied ? 'Copiado!' : 'Copiar'}</span>
    </Button>
  )
}
