import Reveal from './Reveal'

// Shared section header: small kicker line + big display title + subheading.
export default function SectionHeading({ kicker, title, subtitle, align = 'center' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <div className={`flex flex-col ${alignment} max-w-2xl`}>
      {kicker && (
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-hydra">
            <span className="h-1.5 w-1.5 rounded-full bg-hydra shadow-[0_0_10px_#34D399]" />
            {kicker}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-base leading-relaxed text-slatey sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
