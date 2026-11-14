// Local voice recording with MediaRecorder. Audio never leaves the device:
// it becomes an in-memory blob URL that the caller must revoke.

export function isRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  )
}

export interface Recording {
  /** Stops recording; resolves with a playable blob URL. */
  stop: () => Promise<string>
  /** Stops and discards the recording. */
  cancel: () => void
}

/** Asks for the microphone and starts recording. Rejects if permission is denied. */
export async function startRecording(): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const recorder = new MediaRecorder(stream)
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }
  const release = () => {
    for (const track of stream.getTracks()) track.stop()
  }
  recorder.start()

  return {
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          release()
          resolve(
            URL.createObjectURL(
              new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }),
            ),
          )
        }
        recorder.stop()
      }),
    cancel: () => {
      recorder.onstop = release
      if (recorder.state !== 'inactive') recorder.stop()
      else release()
    },
  }
}
