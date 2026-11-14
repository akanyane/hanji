import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { type ChangeEvent, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fadeUp, pop, stagger } from '../../components/motion/presets'
import { Button } from '../../components/ui/Button'
import {
  type Backup,
  BackupError,
  backupFileName,
  backupSummary,
  createBackup,
  parseBackup,
  resetProgress,
  restoreBackup,
  serializeBackup,
} from '../../db/backup'
import { promptInstall, useInstallState } from '../../services/install'
import { settingsStore } from '../../stores/settings'

type Status =
  | { kind: 'idle' }
  | { kind: 'exported' }
  | { kind: 'pending'; backup: Backup }
  | { kind: 'restored' }
  | { kind: 'reset' }
  | { kind: 'error'; reason: BackupError['reason'] }

function download(text: string, fileName: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'application/json' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white dark:border-ink-800 p-5 shadow-paper dark:bg-ink-900"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </motion.section>
  )
}

export function DataPage() {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const fileId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const install = useInstallState()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const exportData = async () => {
    const backup = await createBackup(settingsStore.state)
    download(serializeBackup(backup), backupFileName())
    setStatus({ kind: 'exported' })
  }

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow choosing the same file again
    if (!file) return
    try {
      const backup = parseBackup(
        await file.text(),
        settingsStore.state.theme === 'dark',
      )
      setStatus({ kind: 'pending', backup })
    } catch (error) {
      setStatus({
        kind: 'error',
        reason: error instanceof BackupError ? error.reason : 'invalid',
      })
    }
  }

  const confirmRestore = async (backup: Backup) => {
    await restoreBackup(backup)
    settingsStore.setState(() => backup.settings)
    await queryClient.invalidateQueries()
    setStatus({ kind: 'restored' })
  }

  const reset = async () => {
    if (!window.confirm(t('progress.data.resetConfirm'))) return
    await resetProgress()
    await queryClient.invalidateQueries()
    setStatus({ kind: 'reset' })
  }

  const formatDate = (iso: string) =>
    iso
      ? new Intl.DateTimeFormat(i18n.language, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(iso))
      : '—'

  return (
    <motion.div
      className="grid gap-5 md:grid-cols-2"
      variants={stagger(0, 0.07)}
      initial="hidden"
      animate="visible"
    >
      <Card title={t('progress.data.backupTitle')}>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {t('progress.data.backupText')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportData}>{t('progress.data.export')}</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            {t('progress.data.import')}
          </Button>
          <label htmlFor={fileId} className="sr-only">
            {t('progress.data.importFile')}
          </label>
          <input
            id={fileId}
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onFile}
          />
        </div>

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {status.kind === 'pending' && (
              <motion.div
                key="pending"
                variants={pop}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40"
              >
                <p className="font-semibold">
                  {t('progress.data.confirmTitle')}
                </p>
                <p className="text-sm">
                  {t('progress.data.confirmText', {
                    date: formatDate(status.backup.exportedAt),
                    ...backupSummary(status.backup),
                  })}
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => confirmRestore(status.backup)}>
                    {t('progress.data.confirmRestore')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStatus({ kind: 'idle' })}
                  >
                    {t('progress.data.cancel')}
                  </Button>
                </div>
              </motion.div>
            )}
            {(status.kind === 'exported' ||
              status.kind === 'restored' ||
              status.kind === 'reset') && (
              <motion.p
                key={status.kind}
                variants={pop}
                initial="hidden"
                animate="visible"
                className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
              >
                ✓ {t(`progress.data.done.${status.kind}`)}
              </motion.p>
            )}
            {status.kind === 'error' && (
              <motion.p
                key="error"
                role="alert"
                variants={pop}
                initial="hidden"
                animate="visible"
                className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
              >
                {t(`progress.data.errors.${status.reason}`)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <Card title={t('progress.data.installTitle')}>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {t('progress.data.installText')}
        </p>
        {install.installed ? (
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            ✓ {t('progress.data.installed')}
          </p>
        ) : install.canInstall ? (
          <Button className="self-start" onClick={() => promptInstall()}>
            {t('progress.data.install')}
          </Button>
        ) : (
          <p className="rounded-xl bg-ink-100 p-3 text-sm dark:bg-ink-900/60">
            {t('progress.data.installManual')}
          </p>
        )}
      </Card>

      <Card title={t('progress.data.storageTitle')}>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {t('progress.data.storageText')}
        </p>
      </Card>

      <Card title={t('progress.data.resetTitle')}>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          {t('progress.data.resetText')}
        </p>
        <Button
          variant="secondary"
          className="self-start text-rose-700 dark:text-rose-300"
          onClick={reset}
        >
          {t('progress.data.reset')}
        </Button>
      </Card>
    </motion.div>
  )
}
