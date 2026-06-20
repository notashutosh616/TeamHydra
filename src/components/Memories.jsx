import { content } from '../data/content'
import { useMemories } from '../lib/useMemories'
import SectionHeading from './SectionHeading'
import MemoryGrid from './MemoryGrid'
import GlowButton from './GlowButton'
import Reveal from './Reveal'
import { GalleryLoading, GalleryEmpty } from './GalleryStates'

export default function Memories() {
  const { memories } = content // headings + previewCount (copy stays in content.js)
  const { memories: items, loading, error } = useMemories()

  const previewCount = memories.previewCount ?? items.length
  const preview = items.slice(0, previewCount)
  const total = items.length

  return (
    <section id="memories" className="relative px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading kicker="Rewind" title={memories.heading} subtitle={memories.subheading} />

        <div className="mt-16">
          {loading ? (
            <GalleryLoading count={previewCount} />
          ) : total === 0 ? (
            <GalleryEmpty
              title="No memories yet…"
              hint={
                error === 'not-configured'
                  ? 'Connect Supabase (copy .env.example → .env) and run supabase/setup.sql to fill this gallery.'
                  : 'Add your first row to the “memories” table in Supabase and it’ll appear here.'
              }
            />
          ) : (
            <>
              <MemoryGrid items={preview} />

              {/* See all memories → dedicated gallery page */}
              <Reveal delay={0.1} className="mt-12 flex flex-col items-center gap-3">
                <GlowButton to="/memories">See all memories</GlowButton>
                <span className="text-xs tracking-wide text-slatey">
                  {total} {total === 1 ? 'moment' : 'moments'} &amp; counting — tap to open the full gallery
                </span>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
