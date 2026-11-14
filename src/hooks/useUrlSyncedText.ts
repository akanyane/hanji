import { useDebouncedCallback } from '@tanstack/react-pacer'
import { useEffect, useRef, useState } from 'react'

/**
 * Keeps a text input in local state and mirrors it to the URL with a
 * debounce.
 *
 * Binding an input directly to a URL search param breaks Korean typing: the
 * IME composes syllables in place, and an async router update in the middle
 * of a composition can drop or duplicate jamo. So the input always reads
 * local state, and the URL is only updated once typing pauses.
 *
 * Returns `[text, setText, setTextNow]`. `setTextNow` skips the debounce
 * (e.g. when the user clicks an example).
 */
export function useUrlSyncedText(
  urlValue: string,
  writeToUrl: (value: string) => void,
  wait = 400,
) {
  const [text, setText] = useState(urlValue)
  const lastWritten = useRef(urlValue)
  const debouncedWrite = useDebouncedCallback(writeToUrl, { wait })

  // The URL changed from outside (back/forward, a link): follow it.
  useEffect(() => {
    if (urlValue !== lastWritten.current) {
      lastWritten.current = urlValue
      setText(urlValue)
    }
  }, [urlValue])

  const update = (value: string) => {
    setText(value)
    lastWritten.current = value
    debouncedWrite(value)
  }

  const updateNow = (value: string) => {
    setText(value)
    lastWritten.current = value
    writeToUrl(value)
  }

  return [text, update, updateNow] as const
}
