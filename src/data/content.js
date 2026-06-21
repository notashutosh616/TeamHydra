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
  //  ① THE LIVE COUNTER  —  "X din ho gaye ek dusre ko jhelte hue"
  //     👉 SET YOUR START DATE HERE (format: 'YYYY-MM-DD')
  // ──────────────────────────────────────────────────────────────────────────
  START_DATE: '2022-08-17', // <-- ★ CHANGE THIS to your real start date ★

  // ──────────────────────────────────────────────────────────────────────────
  //  ② HERO SECTION (top of the page)
  // ──────────────────────────────────────────────────────────────────────────
  hero: {
    kicker: 'Est. 2022 · Attendance kam, yaadein zyada',
    title: 'Team Hydra',
    tagline: 'Paanch dimaag, ek braincell. Together since forever.',
    // Shown under the big day-count number → "1389 din ho gaye ek dusre ko..."
    counterLabel: 'din ho gaye ek dusre ko jhelte hue 😩❤️',
    scrollHint: 'Neeche aa', // little label on the scroll-down arrow
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ★ THEME EXTRAS — loading screen, sound, and the hidden easter egg
  //    (Tip: click the glowing Hydra logo 5 times to find the secret!)
  // ──────────────────────────────────────────────────────────────────────────
  ui: {
    // These rotate one-by-one on the first-visit loading screen:
    loaderMessages: [
      'Chai ban rahi hai... ruk',
      'Hydra ko jaga rahe hain...',
      'Proxy lagayi jaa rahi hai...',
      'Mess se bhaag ke aa rahe hain...',
    ],
    soundLabel: 'Alaav', // label on the ambient campfire-sound toggle
    easterEgg: 'Oye! 5 baar click kar diya? Tu bhi utna hi free hai jitne hum the in 4 saalon me 😂🐍',
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ③ THE CREW  —  the 5 member cards (heart of the site)
  //     Each friend is one HEAD of the 5-headed Hydra 🐍
  //     • nickname:   their Hydra alias
  //     • stat:       the funny tag under the nickname (give everyone a diff one)
  //     • accent:     their signature glow colour (warm bonfire palette)
  //     • funnyLine:  the Hinglish one-liner
  //     • message:    the handwritten (Caveat font) personal note — edit later
  // ──────────────────────────────────────────────────────────────────────────
  crew: {
    kicker: 'Apni toli',
    heading: 'Apni Mandli 🐍',
    subheading: 'Paanch log, ek hi braincell pe chalte hain. Inse milo — risk tumhaara.',
    members: [
      {
        id: 'ashutosh',
        name: 'Ashutosh',
        nickname: 'Dhongi',
        stat: 'Attendance: 12%',
        accent: '#34D399', // emerald
        photo: '/assets/member1.svg', // 👉 replace with '/assets/member1.jpg'
        funnyLine:
          'Bahar se sant, andar se mastermind. Chehra masoom, dimaag criminal — Hydra ka asli dhongi.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'shivam',
        name: 'Shivam',
        nickname: 'Bihari',
        stat: 'Chai consumed: ∞',
        accent: '#FBBF24', // amber
        photo: '/assets/member2.svg', // 👉 replace with '/assets/member2.jpg'
        funnyLine:
          '2 ghante argument karega, haarega bhi, phir bhi tujhe chai pila ke aayega. Loyalty ka dusra naam.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'sumit',
        name: 'Sumit',
        nickname: 'Bhabhora',
        stat: 'Padhai: loading…',
        accent: '#FB923C', // firelight orange
        photo: '/assets/member3.svg', // 👉 replace with '/assets/member3.jpg'
        funnyLine:
          'Phone girata hai, chaabi girata hai, marks girata hai, par squad kabhi nahi girne deta.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'devendra',
        name: 'Devendra',
        nickname: 'Dhote',
        stat: 'Mood: hamesha bhookha',
        accent: '#6EE7B7', // soft mint emerald
        photo: '/assets/member4.svg', // 👉 replace with '/assets/member4.jpg'
        funnyLine:
          'Kamre ka sabse chill banda… jab tak bill na aaye. Bill aate hi washroom yaad aa jaata hai.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'sujal',
        name: 'Sujal',
        nickname: 'Suzzi',
        stat: 'Backlog: classified',
        accent: '#FCD34D', // soft gold
        photo: '/assets/member5.svg', // 👉 replace with '/assets/member5.jpg'
        funnyLine:
          'Naam cute, banda khatarnaak. Sabse soft awaaz, sabse deadly roast — group ka chupa rustam.',
        message: 'Yahan apna personal message daalna hai…',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ④ OUR MEMORIES  —  photo + video gallery (data comes from Supabase)
  //     The `items` array below is reference/seed only — see supabase/setup.sql.
  //     Headings, buttons and the empty-state text below DO control the UI.
  // ──────────────────────────────────────────────────────────────────────────
  memories: {
    kicker: 'Throwback',
    heading: 'Yaadein (aur thoda blackmail material)',
    subheading: 'Blurry photos, screenshots, aur woh raatein jinki kasam nahi kha sakte.',

    previewCount: 6, // how many show on the home page before the "see all" button

    // Button + little note under it on the home page ( {count} = how many memories )
    seeAllLabel: 'Saari yaadein dekh',
    seeAllNote: '{count} yaadein records me — tap karke poori gallery dekh',

    // Shown when the gallery has nothing in it yet:
    empty: {
      title: 'Abhi koi yaad nahi hai yahan…',
      hint: 'Kisi ne photo daali hi nahi 🙄 daal de bhai.',
      hintSetup: 'Supabase connect kar (.env) aur supabase/setup.sql chala — phir yaadein aayengi.',
      filtered: 'Is filter me kuch nahi mila — doosra try kar.',
    },

    // The dedicated /memories ("see all") page:
    archive: {
      eyebrow: 'Team Hydra · Purana saman',
      titleLead: 'Saari', // first word (plain)
      titleAccent: 'Yaadein', // second word (gradient)
      subtitle: 'Har pal ek hi jagah — {count} yaadein aur ginti jaari.',
      back: 'Wapas chal',
    },

    items: [
      { type: 'image', src: '/assets/memory1.svg', caption: 'Day one of forever.', span: 'wide' },
      { type: 'image', src: '/assets/memory2.svg', caption: 'Canteen council meeting.' },
      {
        type: 'video',
        src: '/assets/memory-clip.mp4', // 👉 add your real .mp4 here
        poster: '/assets/memory3.svg',
        caption: 'Hostel anthem, unplugged.',
      },
      { type: 'image', src: '/assets/memory4.svg', caption: '3 AM, zero regrets.', span: 'tall' },
      { type: 'image', src: '/assets/memory5.svg', caption: 'Last bench legends.' },
      { type: 'image', src: '/assets/memory6.svg', caption: 'Bonfire & bad ideas.' },
      { type: 'image', src: '/assets/memory7.svg', caption: 'Exam-week survivors.' },
      { type: 'image', src: '/assets/memory8.svg', caption: 'Road trip detour.', span: 'wide' },
      { type: 'image', src: '/assets/memory9.svg', caption: 'One last frame.' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ⑤ WHERE WE GO NEXT  —  closing section
  //     headedTo: where each person is headed next (funny placeholder for now)
  // ──────────────────────────────────────────────────────────────────────────
  next: {
    kicker: 'Aage ka scene',
    heading: 'Ab kaun kidhar farar ho raha hai',
    subheading: 'Degree mil gayi (kisi tarah). Ab sabki apni-apni farari ki kahani.',
    destinations: [
      { name: 'Ashutosh', headedTo: 'Location: abhi suspense me' },
      { name: 'Shivam', headedTo: "Plan: 'dekhte hain'" },
      { name: 'Sumit', headedTo: 'Google Maps bhi confused hai' },
      { name: 'Devendra', headedTo: 'Status: ghar pe Maggi bana raha' },
      { name: 'Sujal', headedTo: 'Pata chalega toh bata dega' },
    ],
    // The one heartfelt line (kept warm on purpose):
    closingLine: 'Raaste alag, dil ek. Team Hydra forever.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ⑥ FOOTER
  // ──────────────────────────────────────────────────────────────────────────
  footer: {
    brand: 'Team Hydra',
    year: '2026',
    note: 'Banaya gaya pyaar se, thodi bewakoofi se, aur bahut saari chai se ☕',
    copyright: '© Hydra. Saare jhagde reserved.',
  },
}

export default content
