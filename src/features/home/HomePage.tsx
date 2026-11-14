import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  cardHover,
  cardTap,
  fadeUp,
  stagger,
} from '../../components/motion/presets'
import { ProgressStrip } from '../progress/ProgressStrip'
import { PLATFORM_MODULES, type PlatformModule } from './modules'

const MotionLink = motion.create(Link)

// Decorative letters floating behind the hero title.
const FLOATING = [
  { char: 'ㄱ', x: '6%', y: '10%', size: 'text-5xl', delay: 0 },
  { char: 'ㅏ', x: '88%', y: '6%', size: 'text-4xl', delay: 0.6 },
  { char: '한', x: '78%', y: '62%', size: 'text-6xl', delay: 1.2 },
  { char: 'ㅎ', x: '18%', y: '70%', size: 'text-4xl', delay: 0.3 },
  { char: '글', x: '52%', y: '-4%', size: 'text-5xl', delay: 0.9 },
  { char: 'ㅇ', x: '95%', y: '40%', size: 'text-3xl', delay: 1.5 },
]

function Hero() {
  const { t } = useTranslation()
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {FLOATING.map((f) => (
          <motion.span
            key={f.char}
            lang="ko"
            className={`absolute font-bold text-white/15 ${f.size}`}
            style={{ left: f.x, top: f.y }}
            animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
            transition={{
              duration: 5,
              delay: f.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            {f.char}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="relative flex flex-col gap-3"
        variants={stagger(0.1, 0.12)}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={fadeUp}
          lang="ko"
          className="text-lg font-semibold text-white/80"
        >
          안녕하세요!
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-3xl font-extrabold sm:text-5xl"
        >
          {t('home.title')}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="max-w-2xl text-white/90 sm:text-lg"
        >
          {t('home.description')}
        </motion.p>
      </motion.div>
    </div>
  )
}

function ModuleCard({ module }: { module: PlatformModule }) {
  const { t } = useTranslation()
  const content = (
    <>
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">
          {t(`home.modules.${module.id}.title`)}
        </span>
        <span lang="ko" className="text-sm text-slate-500 dark:text-slate-400">
          {module.korean}
        </span>
      </span>
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {t(`home.modules.${module.id}.description`)}
      </span>
      {!module.to && (
        <span className="mt-auto pt-2 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {t('common.comingSoon')}
        </span>
      )}
    </>
  )

  const base = 'flex h-full flex-col gap-1 rounded-xl border p-4'
  if (!module.to) {
    return (
      <div
        className={`${base} border-dashed border-slate-300 bg-slate-100/60 dark:border-slate-700 dark:bg-slate-800/40`}
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
      className={`${base} border-slate-300 bg-white shadow-sm hover:border-sky-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-400`}
    >
      {content}
    </MotionLink>
  )
}

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <Hero />
      <ProgressStrip />
      <motion.ul
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={stagger(0.3, 0.05)}
        initial="hidden"
        animate="visible"
      >
        {PLATFORM_MODULES.map((module) => (
          <motion.li key={module.id} variants={fadeUp}>
            <ModuleCard module={module} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
