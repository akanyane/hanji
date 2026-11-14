import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Seal } from '../../components/brand/Seal'
import { BrushStroke } from '../../components/motion/BrushStroke'
import {
  cardHover,
  cardTap,
  fadeUp,
  inkEase,
  stagger,
} from '../../components/motion/presets'
import { cn } from '../../lib/cn'
import { ProgressStrip } from '../progress/ProgressStrip'
import {
  MODULE_GROUPS,
  type ModuleGroup,
  PLATFORM_MODULES,
  type PlatformModule,
} from './modules'

const MotionLink = motion.create(Link)

const GROUP_KOREAN: Record<ModuleGroup, string> = {
  learn: '배우기',
  practice: '연습',
  more: '더 보기',
}
const GROUP_ACCENT: Record<ModuleGroup, string> = {
  learn: 'bg-pine-600',
  practice: 'bg-seal-500',
  more: 'bg-amber-400',
}

/** Ensō-like ink circle that paints itself behind the calligraphy. */
function InkCircle() {
  const reduced = useReducedMotion()
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="absolute inset-0 m-auto h-full w-full text-ink-900/10 dark:text-ink-50/10"
    >
      <motion.path
        d="M 152 46 C 120 18, 58 24, 36 70 C 14 118, 48 172, 104 176 C 158 180, 188 132, 176 88 C 170 66, 158 54, 146 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: inkEase }}
      />
    </svg>
  )
}

function Hero() {
  const { t } = useTranslation()
  const greeting = [...'안녕하세요']

  return (
    <section className="relative grid items-center gap-8 py-6 sm:py-10 md:grid-cols-[1fr_auto]">
      <motion.div
        className="flex flex-col gap-4"
        variants={stagger(0, 0.08)}
        initial="hidden"
        animate="visible"
      >
        <p
          lang="ko"
          className="flex font-serif text-2xl text-seal-600 dark:text-seal-400"
        >
          <span className="sr-only">안녕하세요</span>
          {greeting.map((char, i) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed greeting
              key={i}
              aria-hidden="true"
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
            >
              {char}
            </motion.span>
          ))}
        </p>
        <motion.h1
          variants={fadeUp}
          className="max-w-xl text-4xl leading-tight font-bold sm:text-6xl"
        >
          {t('home.title')}
        </motion.h1>
        <BrushStroke className="-mt-2 w-48 sm:w-64" delay={0.6} />
        <motion.p
          variants={fadeUp}
          className="max-w-xl text-lg text-ink-600 dark:text-ink-300"
        >
          {t('home.description')}
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/hangul"
            className="rounded-lg bg-ink-900 px-5 py-2.5 font-medium text-ink-50 transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--color-seal-500)] dark:bg-ink-50 dark:text-ink-900"
          >
            {t('home.startHangul')} →
          </Link>
          <Link
            to="/progress/placement"
            className="rounded-lg border border-ink-900/80 px-5 py-2.5 font-medium transition-colors hover:bg-ink-900 hover:text-ink-50 dark:border-ink-200/70 dark:hover:bg-ink-50 dark:hover:text-ink-900"
          >
            {t('home.findLevel')}
          </Link>
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="relative mx-auto hidden h-72 w-60 items-center justify-center md:flex"
      >
        <InkCircle />
        <motion.span
          lang="ko"
          className="vertical relative font-serif text-7xl leading-none font-bold tracking-[0.15em]"
          initial={{ opacity: 0, filter: 'blur(12px)', y: -10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: inkEase }}
        >
          한국어
        </motion.span>
        <span className="absolute right-4 bottom-6">
          <Seal text="배움" size="md" animate="stamp" delay={1.5} />
        </span>
      </div>
    </section>
  )
}

function ModuleCard({
  module,
  number,
}: {
  module: PlatformModule
  number: number
}) {
  const { t } = useTranslation()
  const content = (
    <>
      <span
        className={cn(
          'absolute top-0 left-5 h-1 w-10 rounded-b-full transition-all duration-300 group-hover:w-20',
          GROUP_ACCENT[module.group],
        )}
      />
      <span className="flex items-start justify-between gap-3">
        <span className="font-serif text-sm text-ink-400 tabular-nums dark:text-ink-500">
          {String(number).padStart(2, '0')}
        </span>
        <span
          lang="ko"
          className="font-serif text-2xl font-bold text-ink-800 transition-colors duration-300 group-hover:text-seal-600 dark:text-ink-100 dark:group-hover:text-seal-400"
        >
          {module.korean}
        </span>
      </span>
      <span className="mt-3 font-semibold">
        {t(`home.modules.${module.id}.title`)}
      </span>
      <span className="text-sm text-ink-600 dark:text-ink-300">
        {t(`home.modules.${module.id}.description`)}
      </span>
      {!module.to && (
        <span className="mt-auto pt-2 text-xs font-medium tracking-wide text-ink-500 uppercase dark:text-ink-400">
          {t('common.comingSoon')}
        </span>
      )}
    </>
  )

  const base =
    'group relative flex h-full flex-col gap-1 overflow-hidden rounded-lg border p-5 pt-6'
  if (!module.to) {
    return (
      <div
        className={`${base} border-dashed border-ink-300 dark:border-ink-700`}
      >
        {content}
      </div>
    )
  }
  return (
    <MotionLink
      to={module.to}
      whileHover={cardHover}
      whileTap={cardTap}
      className={`${base} border-ink-200 bg-white shadow-paper dark:border-ink-800 dark:bg-ink-900`}
    >
      {content}
    </MotionLink>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  let number = 0
  return (
    <div className="flex flex-col gap-10">
      <Hero />
      <ProgressStrip />
      {MODULE_GROUPS.map((group) => (
        <section key={group} className="flex flex-col gap-4">
          <motion.h2
            className="flex items-baseline gap-3 text-xl font-bold"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: inkEase }}
          >
            <span
              lang="ko"
              aria-hidden="true"
              className="font-serif text-sm text-seal-600 dark:text-seal-400"
            >
              {GROUP_KOREAN[group]}
            </span>
            {t(`home.groups.${group}`)}
            <span className="h-px flex-1 self-center bg-ink-200 dark:bg-ink-800" />
          </motion.h2>
          <motion.ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger(0.05, 0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {PLATFORM_MODULES.filter((m) => m.group === group).map((module) => {
              number++
              return (
                <motion.li key={module.id} variants={fadeUp}>
                  <ModuleCard module={module} number={number} />
                </motion.li>
              )
            })}
          </motion.ul>
        </section>
      ))}
    </div>
  )
}
