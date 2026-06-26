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
    counterLabel: 'din ho gaye ek dusre ko jhelte hue 😩❤️',
    scrollHint: 'Neeche aa',
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ★ THEME EXTRAS — loading screen, sound, and the hidden easter egg
  //    (Tip: click the bonfire 5 times to find the secret!)
  // ──────────────────────────────────────────────────────────────────────────
  ui: {
    loaderMessages: [
      'Chai ban rahi hai... ruk',
      'Hydra ko jaga rahe hain...',
      'Proxy lagayi jaa rahi hai...',
      'Mess se bhaag ke aa rahe hain...',
    ],
    soundLabel: 'Alaav',
    easterEgg: 'Oye! 5 baar click kar diya? Tu bhi utna hi free hai jitne hum the in 4 saalon me 😂🐍',
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ③ THE CREW  —  the 5 member cards
  // ──────────────────────────────────────────────────────────────────────────
  crew: {
    kicker: 'Apni toli',
    heading: 'Apni Mandli 🐍',
    subheading: 'Paanch log, ek hi braincell pe chalte hain. Inse milo — risk tumhaara.',
    // 🏆 HYDRA AWARDS — the funny award title shown on each member card.
    //    Keyed by the member's nickname. Edit these freely.
    awardLabel: 'Hydra Award 🏆',
    awards: {
      Dhongi: "Crime karke sabse pehle 'main toh tha hi nahi' bolne wala",
      Bihari: 'Bina matlab ke argument jeetne ka national champion',
      Bhabhora: 'Apne hi haath me phone dhoondhne wala mahapurush',
      Dhote: 'Bill aate hi gayab hone wala jaadugar',
      Suzzi: 'Doston se zyada khaane se pyaar karne wala',
    },

    members: [
      {
        id: 'ashutosh',
        name: 'Ashutosh',
        nickname: 'Dhongi',
        stat: 'Attendance: 12%',
        accent: '#34D399',
        photo: '/assets/member1.svg',
        funnyLine:
          'Bahar se sant, andar se mastermind. Chehra masoom, dimaag criminal — Hydra ka asli dhongi.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'shivam',
        name: 'Shivam',
        nickname: 'Bihari',
        stat: 'Chai consumed: ∞',
        accent: '#FBBF24',
        photo: '/assets/member2.svg',
        funnyLine:
          '2 ghante argument karega, haarega bhi, phir bhi tujhe chai pila ke aayega. Loyalty ka dusra naam.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'sumit',
        name: 'Sumit',
        nickname: 'Bhabhora',
        stat: 'Padhai: loading…',
        accent: '#FB923C',
        photo: '/assets/member3.svg',
        funnyLine:
          'Phone girata hai, chaabi girata hai, marks girata hai, par squad kabhi nahi girne deta.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'devendra',
        name: 'Devendra',
        nickname: 'Dhote',
        stat: 'Mood: hamesha bhookha',
        accent: '#6EE7B7',
        photo: '/assets/member4.svg',
        funnyLine:
          'Kamre ka sabse chill banda… jab tak bill na aaye. Bill aate hi washroom yaad aa jaata hai.',
        message: 'Yahan apna personal message daalna hai…',
      },
      {
        id: 'sujal',
        name: 'Sujal',
        nickname: 'Suzzi',
        stat: 'Backlog: classified',
        accent: '#FCD34D',
        photo: '/assets/member5.svg',
        funnyLine:
          'Naam cute, banda khatarnaak. Sabse soft awaaz, sabse deadly roast — group ka chupa rustam.',
        message: 'Yahan apna personal message daalna hai…',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ④ OUR MEMORIES  —  photo + video gallery (data comes from Supabase)
  // ──────────────────────────────────────────────────────────────────────────
  memories: {
    kicker: 'Throwback',
    heading: 'Yaadein (aur thoda blackmail material)',
    subheading: 'Blurry photos, screenshots, aur woh raatein jinki kasam nahi kha sakte.',
    previewCount: 6,
    seeAllLabel: 'Saari yaadein dekh',
    seeAllNote: '{count} yaadein records me — tap karke poori gallery dekh',
    empty: {
      title: 'Abhi koi yaad nahi hai yahan…',
      hint: 'Kisi ne photo daali hi nahi 🙄 daal de bhai.',
      hintSetup: 'Supabase connect kar (.env) aur supabase/setup.sql chala — phir yaadein aayengi.',
      filtered: 'Is filter me kuch nahi mila — doosra try kar.',
    },
    archive: {
      eyebrow: 'Team Hydra · Purana saman',
      titleLead: 'Saari',
      titleAccent: 'Yaadein',
      subtitle: 'Har pal ek hi jagah — {count} yaadein aur ginti jaari.',
      back: 'Wapas chal',
    },
    // NOTE: the gallery shows ONLY real rows from the Supabase "memories"
    // table (added via the admin panel). There are NO hardcoded/demo items.
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ⑤ HYDRA ACROSS INDIA — where each friend's home city is (map section)
  //     • origin = the college where everyone met (the amber bonfire marker)
  //     • each friend has a HOME city. lat/lon place the glowing pin on the map
  //       (tweak lat/lon to nudge a pin; city/note are just the labels)
  // ──────────────────────────────────────────────────────────────────────────
  india: {
    kicker: '5 cities, 1 team',
    heading: 'Hydra Across India',
    subheading: 'Alag-alag kone se aaye, Bhopal me takra gaye — yahin Team Hydra bana.',
    origin: {
      label: 'Oriental College of Technology',
      city: 'Bhopal, MP',
      tag: 'Adda No.1',
      note: 'Yahin sab shuru hua — Team Hydra ka asli adda.',
      lat: 23.2599,
      lon: 77.4126,
    },
    friends: [
      { name: 'Ashutosh', nickname: 'Dhongi', city: 'Satna, MP', lat: 24.58, lon: 80.83, accent: '#34D399', labelDx: 0, labelDy: -14, labelAnchor: 'middle', note: 'Satna se Bhopal — dhongi-giri ab all-India level pe.' },
      { name: 'Shivam', nickname: 'Bihari', city: 'Chhapra, Bihar', lat: 25.78, lon: 84.73, accent: '#34D399', labelDx: 7, labelDy: -13, labelAnchor: 'start', note: 'Chhapra ka launda, argument ka aajeevan champion.' },
      { name: 'Sujal', nickname: 'Suzzi', city: 'Guwahati, Assam', lat: 26.1445, lon: 91.7362, accent: '#34D399', labelDx: -13, labelDy: 3, labelAnchor: 'end', note: 'Sabse door se aaya — soft awaaz, deadly roast.' },
      { name: 'Devendra', nickname: 'Dhote', city: 'Betul, MP', lat: 21.9012, lon: 77.9010, accent: '#34D399', labelDx: 0, labelDy: 20, labelAnchor: 'middle', note: 'Betul ka jungle aur iska chill — dono famous.' },
      { name: 'Sumit', nickname: 'Bhabhora', city: 'Ghazipur, UP', lat: 25.588, lon: 83.5776, accent: '#34D399', labelDx: 0, labelDy: 20, labelAnchor: 'middle', note: 'Ghazipur se Bhopal — raaste me aadha saaman gira diya.' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ⑥ WHERE WE GO NEXT  —  closing section
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
    closingLine: 'Raaste alag, dil ek. Team Hydra forever.',
  },

  // ──────────────────────────────────────────────────────────────────────────
  //  ⑦ FOOTER
  // ──────────────────────────────────────────────────────────────────────────
  footer: {
    brand: 'Team Hydra',
    year: '2026',
    note: 'Banaya gaya pyaar se, thodi bewakoofi se, aur bahut saari chai se ☕',
    copyright: '© Hydra. Saare jhagde reserved.',
  },
}

export default content
