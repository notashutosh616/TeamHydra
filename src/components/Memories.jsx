import { content } from '../data/content'
import { useMemories } from '../lib/useMemories'
import SectionHeading from './SectionHeading'
import MemoryGrid from './MemoryGrid'
import GlowButton from './GlowButton'
import Reveal from './Reveal'
import { GalleryLoading, GalleryEmpty } from './GalleryStates'

export default function Memories() {
  const { memories } = content // headings + previewCount + copy (all in content.js)
  const { memories: items, loading, error } = useMemories()

  const previewCount = memories.previewCount ?? items.length
  const preview = items.slice(0, previewCount)
  const total = items.length

  return (
    <section id="memories" className="relative px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading kicker={memories.kicker} title={memories.heading} subtitle={memories.subheading} />

        <div className="mt-16">
          {loading ? (
            <GalleryLoading count={previewCount} />
          ) : total === 0 ? (
            <GalleryEmpty
              title={memories.empty.title}
              hint={error === 'not-configured' ? memories.empty.hintSetup : memories.empty.hint}
            />
          ) : (
            <>
              <MemoryGrid items={preview} />

              {/* See all memories → dedicated gallery page */}
              <Reveal delay={0.1} className="mt-12 flex flex-col items-center gap-3">
                <GlowButton to="/memories">{memories.seeAllLabel}</GlowButton>
                <span className="text-xs tracking-wide text-slatey">
                  {memories.seeAllNote.replace('{count}', total)}
                </span>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
