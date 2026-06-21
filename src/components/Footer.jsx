import { content } from '../data/content'
import { useEasterEgg } from '../lib/easterEgg'

export default function Footer() {
  const { footer } = content
  const egg = useEasterEgg()

  return (
    <footer className="relative px-5 pb-12 pt-8">
      <div className="mx-auto max-w-content">
        <div className="hairline mb-10" />
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Brand — quietly the secret 5-click easter-egg trigger */}
          <button
            onClick={() => egg?.registerHydraClick()}
            data-cursor="hot"
            aria-label="Team Hydra"
            className="font-display text-lg font-semibold tracking-wide text-ink transition-opacity hover:opacity-90"
          >
            {footer.brand} <span className="text-slatey">•</span>{' '}
            <span className="text-gradient">{footer.year}</span>
          </button>

          <p className="max-w-md text-sm text-slatey">{footer.note}</p>
          <p className="text-xs text-slatey/70">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
