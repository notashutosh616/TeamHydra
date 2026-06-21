import { content } from '../data/content'
import SectionHeading from './SectionHeading'
import MemberCard from './MemberCard'

export default function Crew() {
  const { crew } = content
  return (
    <section id="crew" className="relative px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-content">
        <SectionHeading kicker={crew.kicker} title={crew.heading} subtitle={crew.subheading} />

        {/*
          5 cards. On large screens we use a 6-column grid where every card
          spans 2 cols; nudging the 4th card to col-start-2 centres the final
          row of two so it never looks lopsided.
        */}
        <ul
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6
                     [&>li]:lg:col-span-2 [&>li:nth-child(4)]:lg:col-start-2"
        >
          {crew.members.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
