import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Crew from '../components/Crew'
import Memories from '../components/Memories'
import NextChapter from '../components/NextChapter'
import Footer from '../components/Footer'
import ScrollRail from '../components/ScrollRail'
import AcrossIndia from '../components/AcrossIndia'
import EmberDivider from '../components/EmberDivider'
import Bonfire from '../components/Bonfire'

export default function Home() {
  return (
    <motion.main
      className="relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Vertical journey timeline (desktop) */}
      <ScrollRail />

      <Hero />
      <EmberDivider />
      <Crew />
      <EmberDivider />
      <Memories />
      <EmberDivider />
      <AcrossIndia />
      <EmberDivider />
      <NextChapter />

      {/* Closing bonfire — the night winds down */}
      <motion.div
        className="relative flex justify-center px-5 pb-2 pt-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Bonfire className="w-[min(50vw,180px)]" />
      </motion.div>

      <Footer />
    </motion.main>
  )
}
