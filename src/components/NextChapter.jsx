import { motion } from 'framer-motion'
import { content } from '../data/content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

const EASE = [0.16, 1, 0.3, 1]

export default function NextChapter() {
  const { next } = content
  return (
    <section id="next" className="relative px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading kicker={next.kicker} title={next.heading} subtitle={next.subheading} />

        {/* Destinations timeline */}
        <ul className="mt-14 space-y-4">
          {next.destinations.map((d, i) => (
            <motion.li
              key={d.name}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className="group flex items-center gap-4 rounded-2xl glass px-5 py-4 transition-colors duration-300 hover:border-ember/30 sm:gap-6 sm:px-7 sm:py-5"
            >
              {/* Node */}
              <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                <span className="absolute h-3 w-3 animate-pulse-glow rounded-full bg-hydra/40" />
                <span className="h-2 w-2 rounded-full bg-hydra shadow-[0_0_10px_#34D399]" />
              </span>

              <span className="w-28 shrink-0 font-display text-lg font-semibold text-ink sm:w-32 sm:text-xl">
                {d.name}
              </span>

              <svg className="hidden h-4 w-4 shrink-0 text-slatey transition-transform duration-300 group-hover:translate-x-1 sm:block"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>

              <span className="flex-1 text-right text-sm text-slatey sm:text-left sm:text-base">
                {d.headedTo}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* Emotional closing line */}
        <Reveal delay={0.1} className="mt-20 text-center">
          <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-ember to-transparent" />
          <p className="font-hand text-4xl leading-tight text-gradient sm:text-6xl">
            {next.closingLine}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
