// ════════════════════════════════════════════════════════════════════════════
//
//   ✦  TEAM HYDRA — EDIT EVERYTHING HERE  ✦
//
//   This is the ONLY file you need to touch to change text, names, messages,
//   photos, videos, the start date and the taglines.
//   You do NOT need to open any component file.
//
//   HOW TO ADD PHOTOS / VIDEOS:
//     1. Drop your files into:   public/assets/
//     2. Point to them below like:   '/assets/your-file-name.jpg'
//        (the path ALWAYS starts with /assets/ )
//
//   Placeholder images (the nice gradient ones) live in public/assets/ already
//   so the site looks good before you add real photos. Replace them whenever.
//
// ════════════════════════════════════════════════════════════════════════════

export const content = {
  // ──────────────────────────────────────────────────────────────────────────
  //  ① THE LIVE COUNTER  —  "X days since we became a team"
  //     👉 SET YOUR START DATE HERE (format: 'YYYY-MM-DD')
  //     This is the day Team Hydra became a team.
  // ──────────────────────────────────────────────────────────────────────────
  START_DATE: '2022-08-01', // <-- ★ CHANGE THIS to your real start date ★

  // ──────────────────────────────────────────────────────────────────────────
  //  ② HERO SECTION (top of the page)
  // ──────────────────────────────────────────────────────────────────────────
  hero: {
    kicker: 'Est. 2022 · College ke paanch yaar',
    title: 'Team Hydra',
    // The warm tagline shown under the title:
    tagline: 'Paanch dost, ek team, infinite memories.',
    // Label shown after the live day-count number:
    counterLabel: 'days since we became a team',
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ③ THE CREW  —  the 5 member cards (heart of the site)
  //     • photo:      path to the member's photo in /assets/
  //     • funnyLine:  the Hinglish one-liner under the name
  //     • message:    the handwritten (Caveat font) personal note — edit later
  // ──────────────────────────────────────────────────────────────────────────
  crew: {
    heading: 'The Crew',
    subheading: 'Paanch alag personalities. Ek hi paagalpan. Yeh hai Hydra.',
    members: [
      {
        id: 'ashutosh',
        name: 'Ashutosh',
        nickname: 'Dhongi',
        photo: '/assets/member1.svg', // 👉 replace with '/assets/member1.jpg'
        funnyLine:
          'Bahar se sant, andar se mastermind. Chehra masoom, dimaag criminal — Hydra ka asli dhongi.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'shivam',
        name: 'Shivam',
        nickname: 'Bihari',
        photo: '/assets/member2.svg', // 👉 replace with '/assets/member2.jpg'
        funnyLine:
          '2 ghante argument karega, haarega bhi, phir bhi tujhe chai pila ke aayega. Loyalty ka dusra naam.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'sumit',
        name: 'Sumit',
        nickname: 'Bhabhora',
        photo: '/assets/member3.svg', // 👉 replace with '/assets/member3.jpg'
        funnyLine:
          'Phone girata hai, chaabi girata hai, marks girata hai, par squad kabhi nahi girne deta.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'devendra',
        name: 'Devendra',
        nickname: 'Dhote',
        photo: '/assets/member4.svg', // 👉 replace with '/assets/member4.jpg'
        funnyLine:
          'Kamre ka sabse chill banda… jab tak bill na aaye. Bill aate hi washroom yaad aa jaata hai.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'sujal',
        name: 'Sujal',
        nickname: 'Suzzi',
        photo: '/assets/member5.svg', // 👉 replace with '/assets/member5.jpg'
        funnyLine:
          'Naam cute, banda khatarnaak. Sabse soft awaaz, sabse deadly roast — group ka chupa rustam.',
        message: 'Yahan apna personal message daalna hai…',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ④ OUR MEMORIES  —  photo + video gallery
  //     Add as many items as you like. Two kinds are supported:
  //
  //       IMAGE:  { type: 'image', src: '/assets/memory1.jpg', caption: '...' }
  //       VIDEO:  { type: 'video', src: '/assets/clip.mp4',
  //                 poster: '/assets/clip-poster.jpg', caption: '...' }
  //
  //     • src     → the photo OR the .mp4 video file
  //     • poster  → (videos only) a thumbnail image shown before it plays
  //     • caption → optional little label shown in the lightbox
  //     • span    → optional 'wide' or 'tall' to make an item bigger in the grid
  //
  //   Click any item on the site to open it big in a lightbox.
  // ──────────────────────────────────────────────────────────────────────────
  memories: {
    // NOTE: the gallery's photos/videos now come from SUPABASE (the "memories"
    // table) — see src/lib/supabase.js and supabase/setup.sql. The heading,
    // subheading and previewCount below still control the section here.
    // The `items` array is no longer rendered; it's kept only as reference/seed.
    heading: 'Our Memories',
    subheading: 'Late nights, longer chai breaks, aur woh hassi jo kabhi rukti hi nahi thi.',

    // 👉 How many memories to show on the HOME page before the
    //    "See all memories" button. The full set always shows on the
    //    dedicated /memories page. Add as many items below as you like —
    //    the See-all page will grow automatically.
    previewCount: 6,

    items: [
      { type: 'image', src: '/assets/memory1.svg', caption: 'Day one of forever.', span: 'wide' },
      { type: 'image', src: '/assets/memory2.svg', caption: 'Canteen council meeting.' },
      {
        // Example VIDEO item — drop a real clip at public/assets/memory-clip.mp4
        type: 'video',
        src: '/assets/memory-clip.mp4', // 👉 add your real .mp4 here
        poster: '/assets/memory3.svg', // thumbnail shown before play
        caption: 'Hostel anthem, unplugged.',
      },
      { type: 'image', src: '/assets/memory4.svg', caption: '3 AM, zero regrets.', span: 'tall' },
      { type: 'image', src: '/assets/memory5.svg', caption: 'Last bench legends.' },
      { type: 'image', src: '/assets/memory6.svg', caption: 'Bonfire & bad ideas.' },
      // ↓↓↓ these only appear on the "See all memories" page (beyond previewCount)
      { type: 'image', src: '/assets/memory7.svg', caption: 'Exam-week survivors.' },
      { type: 'image', src: '/assets/memory8.svg', caption: 'Road trip detour.', span: 'wide' },
      { type: 'image', src: '/assets/memory9.svg', caption: 'One last frame.' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ⑤ WHERE WE GO NEXT  —  closing section
  //     headedTo: where each person is headed next (job, city, masters, etc.)
  // ──────────────────────────────────────────────────────────────────────────
  next: {
    heading: 'Where We Go Next',
    subheading: 'Alag sheher, alag sapne — par dil ek hi raha.',
    destinations: [
      { name: 'Ashutosh', headedTo: 'Likhna abhi baaki hai…' },
      { name: 'Shivam', headedTo: 'Likhna abhi baaki hai…' },
      { name: 'Sumit', headedTo: 'Likhna abhi baaki hai…' },
      { name: 'Devendra', headedTo: 'Likhna abhi baaki hai…' },
      { name: 'Sujal', headedTo: 'Likhna abhi baaki hai…' },
    ],
    closingLine: 'Raaste alag, dil ek. Team Hydra forever.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ⑥ FOOTER
  // ──────────────────────────────────────────────────────────────────────────
  footer: {
    brand: 'Team Hydra',
    year: '2026',
    note: 'Built with chai, code, and a little bit of crying.',
  },
}

export default content
