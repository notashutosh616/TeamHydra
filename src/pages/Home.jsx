import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Crew from '../components/Crew'
import Memories from '../components/Memories'
import NextChapter from '../components/NextChapter'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <motion.main
      className="relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <Crew />
      <Memories />
      <NextChapter />
      <Footer />
    </motion.main>
  )
}
