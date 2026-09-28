// Default High-Fidelity Data for E-SPORTS BANGLADESH
// Serves as seed data and instant zero-config fallback

const games = [
  {
    id: "free-fire",
    slug: "free-fire",
    title: "Free Fire",
    name: "Garena Free Fire",
    shortName: "Free Fire",
    genre: "Battle Royale",
    platform: "Mobile",
    bannerUrl: "/img/games/free-fire.png",
    iconUrl: "/img/games/free-fire.png",
    activeTournamentsCount: 2,
    rules: "4v4 Clash Squad or 48-Player BR. Mobile only (no emulators)."
  },
  {
    id: "pubg-mobile",
    slug: "pubg-mobile",
    title: "PUBG Mobile",
    name: "PUBG Mobile",
    shortName: "PUBG Mobile",
    genre: "Battle Royale",
    platform: "Mobile",
    bannerUrl: "/img/games/pubg-mobile.png",
    iconUrl: "/img/games/pubg-mobile.png",
    activeTournamentsCount: 2,
    rules: "Squad TPP. Erangel, Miramar & Sanhok rotations."
  },
  {
    id: "valorant",
    slug: "valorant",
    title: "Valorant",
    name: "Valorant",
    shortName: "Valorant",
    genre: "Tactical FPS",
    platform: "PC",
    bannerUrl: "/img/games/valorant.png",
    iconUrl: "/img/games/valorant.png",
    activeTournamentsCount: 1,
    rules: "5v5 Tournament Mode, Vanguard Anti-Cheat required."
  },
  {
    id: "cs2",
    slug: "cs2",
    title: "CS2",
    name: "Counter-Strike 2",
    shortName: "CS2",
    genre: "Tactical FPS",
    platform: "PC",
    bannerUrl: "/img/games/cs2.png",
    iconUrl: "/img/games/cs2.png",
    activeTournamentsCount: 1,
    rules: "5v5 Competitive MR12 with overtime."
  },
  {
    id: "efootball",
    slug: "efootball",
    title: "eFootball",
    name: "eFootball 2026",
    shortName: "eFootball",
    genre: "Sports Simulation",
    platform: "Cross-Platform",
    bannerUrl: "/img/games/efootball.png",
    iconUrl: "/img/games/efootball.png",
    activeTournamentsCount: 1,
    rules: "1v1 Exhibition, standard 10-minute match length."
  },
  {
    id: "mobile-legends",
    slug: "mobile-legends",
    title: "Mobile Legends",
    name: "Mobile Legends: Bang Bang",
    shortName: "MLBB",
    genre: "MOBA",
    platform: "Mobile",
    bannerUrl: "/img/games/mobile-legends.png",
    iconUrl: "/img/games/mobile-legends.png",
    activeTournamentsCount: 1,
    rules: "5v5 Custom Draft Pick."
  },
  {
    id: "honor-of-kings",
    slug: "honor-of-kings",
    title: "Honor of Kings",
    name: "Honor of Kings",
    shortName: "HOK",
    genre: "MOBA",
    platform: "Mobile",
    bannerUrl: "/img/games/honor-of-kings.png",
    iconUrl: "/img/games/honor-of-kings.png",
    activeTournamentsCount: 1,
    rules: "5v5 Standard Tournament Draft."
  },
  {
    id: "cod-mobile",
    slug: "cod-mobile",
    title: "Call of Duty: Mobile",
    name: "Call of Duty: Mobile",
    shortName: "CODM",
    genre: "FPS",
    platform: "Mobile",
    bannerUrl: "/img/games/cod-mobile.png",
    iconUrl: "/img/games/cod-mobile.png",
    activeTournamentsCount: 0,
    rules: "5v5 Search & Destroy + Hardpoint ruleset."
  }
];

const tournaments = [
  {
    id: "esbd-ff-pro-s4",
    slug: "free-fire-pro-league-s4",
    title: "ESBD Free Fire Pro League: Season 4",
    game: "Free Fire",
    gameId: "free-fire",
    format: "Battle Royale (Squad)",
    status: "live",
    prizePool: "BDT 1,50,000",
    prizePoolMinor: 15000000,
    currency: "BDT",
    entryFee: "Free",
    entryFeeMinor: 0,
    sponsor: "ASUS ROG & UCC",
    startDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    slots: 48,
    registeredCount: 48,
    bannerUrl: "/img/games/free-fire.png",
    rules: [
      "Must be a resident of Bangladesh.",
      "Mobile devices only. Tablets and emulators strictly forbidden.",
      "Custom room credentials delivered 15 minutes before lobby launch in Player Portal.",
      "All squad captains must join official ESBD Discord check-in channel."
    ],
    registeredTeams: [
      { id: "t1", name: "RedX Esports", tag: "REDX", captainIgn: "RedX_Vampire", checkedIn: true },
      { id: "t2", name: "Team Legion BD", tag: "LGN", captainIgn: "Legion_Ghost", checkedIn: true },
      { id: "t3", name: "Apex Predators", tag: "APX", captainIgn: "Apex_Sniper", checkedIn: true },
      { id: "t4", name: "Delta Force BD", tag: "DF", captainIgn: "Delta_Ruler", checkedIn: false }
    ],
    bracket: {
      rounds: [
        {
          name: "Semifinals",
          matches: [
            {
              id: "m-ff-01",
              status: "live",
              teamA: { name: "RedX Esports", score: 1 },
              teamB: { name: "Team Legion BD", score: 0 },
              roomCode: "ESBD-FF-492",
              roomPassword: "esbd"
            },
            {
              id: "m-ff-02",
              status: "scheduled",
              teamA: { name: "Apex Predators", score: 0 },
              teamB: { name: "Delta Force BD", score: 0 },
              roomCode: "ESBD-FF-493",
              roomPassword: "esbd"
            }
          ]
        },
        {
          name: "Grand Finals",
          matches: [
            {
              id: "m-ff-finals",
              status: "scheduled",
              teamA: { name: "TBD", score: 0 },
              teamB: { name: "TBD", score: 0 }
            }
          ]
        }
      ]
    }
  },
  {
    id: "esbd-val-inv-2026",
    slug: "valorant-champions-invitational",
    title: "Valorant Bangladesh Champions Invitational",
    game: "Valorant",
    gameId: "valorant",
    format: "Single Elimination (BO3)",
    status: "registration_open",
    prizePool: "BDT 2,50,000",
    prizePoolMinor: 25000000,
    currency: "BDT",
    entryFee: "Free",
    entryFeeMinor: 0,
    sponsor: "Gigabyte AORUS & MSI",
    startDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    slots: 32,
    registeredCount: 28,
    bannerUrl: "/img/games/valorant.png",
    rules: [
      "Riot Vanguard must be active with no third-party overlays.",
      "Best of 3 series from Quarterfinals onwards.",
      "Map vetoes conducted on ESBD Match Console."
    ],
    registeredTeams: [
      { id: "tv1", name: "Velocity Gaming BD", tag: "VLY", captainIgn: "Velocity_Aces", checkedIn: false },
      { id: "tv2", name: "Fatal Strike", tag: "FS", captainIgn: "Fatal_Kyro", checkedIn: false }
    ],
    bracket: {
      rounds: [
        {
          name: "Quarterfinals",
          matches: [
            {
              id: "m-val-01",
              status: "scheduled",
              teamA: { name: "Velocity Gaming BD", score: 0 },
              teamB: { name: "Fatal Strike", score: 0 }
            }
          ]
        }
      ]
    }
  },
  {
    id: "esbd-pubgm-cup",
    slug: "pubg-mobile-national-cup",
    title: "PUBG Mobile National Showdown 2026",
    game: "PUBG Mobile",
    gameId: "pubg-mobile",
    format: "Battle Royale (Squad)",
    status: "registration_open",
    prizePool: "BDT 2,00,000",
    prizePoolMinor: 20000000,
    currency: "BDT",
    entryFee: "Free",
    entryFeeMinor: 0,
    sponsor: "ViewSonic & ZOTAC",
    startDate: new Date(Date.now() + 9 * 24 * 3600 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    slots: 64,
    registeredCount: 52,
    bannerUrl: "/img/games/pubg-mobile.png",
    rules: [
      "Official 10-point scoring matrix + 1 point per kill.",
      "Strict zero-tolerance on device bypassers or rooted ROMs."
    ],
    registeredTeams: []
  },
  {
    id: "esbd-cs2-masters",
    slug: "cs2-dhaka-masters-lan",
    title: "CS2 Dhaka Masters LAN Season 2",
    game: "CS2",
    gameId: "cs2",
    format: "Double Elimination",
    status: "registration_open",
    prizePool: "BDT 1,80,000",
    prizePoolMinor: 18000000,
    currency: "BDT",
    entryFee: "Free",
    entryFeeMinor: 0,
    sponsor: "Thermaltake BD",
    startDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    endDate: new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString(),
    slots: 16,
    registeredCount: 12,
    bannerUrl: "/img/games/cs2.png",
    rules: [
      "128-Tick tournament servers with VAC & custom server anti-cheat.",
      "LAN finals held in Dhaka."
    ],
    registeredTeams: []
  },
  {
    id: "esbd-efootball-cup",
    slug: "efootball-bangladesh-cup",
    title: "eFootball Bangladesh Open Championship",
    game: "eFootball",
    gameId: "efootball",
    format: "Single Elimination",
    status: "completed",
    prizePool: "BDT 80,000",
    prizePoolMinor: 8000000,
    currency: "BDT",
    entryFee: "Free",
    entryFeeMinor: 0,
    sponsor: "ESBD Official",
    startDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    endDate: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    slots: 64,
    registeredCount: 64,
    bannerUrl: "/img/games/efootball.png",
    rules: [
      "10-minute exhibition match. Extra time + penalties if tied."
    ],
    registeredTeams: []
  }
];

const stats = {
  totalPlayers: 85400,
  playersManaged: "85,000+",
  totalProjects: 1240,
  projectsDelivered: "1200+",
  lanExecutions: "200+",
  totalPrizeMinor: 2500000000,
  totalPrizeBDT: "2.5 Crore+",
  audienceReached: "2.5M+",
  companiesServed: "100+",
  activeTournaments: 4
};

const influencers = [
  {
    id: "mr-triple-r",
    name: "MrTripleR",
    handle: "@mrtripler",
    followersRank: 5800000,
    followersDisplay: "5.8M",
    avatarUrl: "/img/influencers/mr-triple-r.jpg",
    category: "mega",
    platforms: ["YouTube", "Facebook"],
    featured: true
  },
  {
    id: "itz-kabbo",
    name: "Itz Kabbo",
    handle: "@itzkabbo",
    followersRank: 4200000,
    followersDisplay: "4.2M",
    avatarUrl: "/img/influencers/itz-kabbo.jpg",
    category: "mega",
    platforms: ["YouTube", "Facebook", "Instagram"],
    featured: true
  },
  {
    id: "gaming-with-talha",
    name: "Gaming With Talha",
    handle: "@gamingwithtalha",
    followersRank: 2900000,
    followersDisplay: "2.9M",
    avatarUrl: "/img/influencers/gaming-with-talha.jpg",
    category: "macro",
    platforms: ["YouTube", "Facebook"],
    featured: true
  },
  {
    id: "gaming-with-zihad",
    name: "Gaming with Zihad",
    handle: "@gamingwithzihad",
    followersRank: 2400000,
    followersDisplay: "2.4M",
    avatarUrl: "/img/influencers/gaming-with-zihad.jpg",
    category: "macro",
    platforms: ["YouTube", "Facebook"],
    featured: true
  },
  {
    id: "roasted-gaming",
    name: "Roasted Gaming BD",
    handle: "@roastedgamingbd",
    followersRank: 1800000,
    followersDisplay: "1.8M",
    avatarUrl: "/img/influencers/roasted-gaming.jpg",
    category: "macro",
    platforms: ["YouTube"],
    featured: true
  },
  {
    id: "timeburnergg",
    name: "TimeBurner GG",
    handle: "@timeburnergg",
    followersRank: 950000,
    followersDisplay: "950K",
    avatarUrl: "/img/influencers/timeburnergg.jpg",
    category: "macro",
    platforms: ["YouTube", "Twitch"],
    featured: false
  },
  {
    id: "sinister-plays",
    name: "Sinister Plays",
    handle: "@sinisterplays",
    followersRank: 680000,
    followersDisplay: "680K",
    avatarUrl: "/img/influencers/sinister-plays.jpg",
    category: "macro",
    platforms: ["YouTube"],
    featured: false
  },
  {
    id: "arpon-plays-yt",
    name: "Arpon Plays",
    handle: "@arponplays",
    followersRank: 430000,
    followersDisplay: "430K",
    avatarUrl: "/img/influencers/arpon-plays-yt.jpg",
    category: "rising",
    platforms: ["YouTube"],
    featured: false
  },
  {
    id: "rzjax-gaming",
    name: "Rzjax Gaming",
    handle: "@rzjaxgaming",
    followersRank: 320000,
    followersDisplay: "320K",
    avatarUrl: "/img/influencers/rzjax-gaming.jpg",
    category: "rising",
    platforms: ["YouTube"],
    featured: false
  },
  {
    id: "apollo-gaming",
    name: "Apollo Gaming",
    handle: "@apollogaming",
    followersRank: 280000,
    followersDisplay: "280K",
    avatarUrl: "/img/influencers/apollo-gaming.jpg",
    category: "rising",
    platforms: ["YouTube"],
    featured: false
  }
];

const clients = [
  { id: "asus", name: "ASUS Republic of Gamers", category: "Hardware & Peripherals", logoUrl: "/img/clients/asus.png", websiteUrl: "https://rog.asus.com" },
  { id: "gigabyte", name: "Gigabyte AORUS", category: "Motherboards & GPUs", logoUrl: "/img/clients/gigabyte.png", websiteUrl: "https://www.aorus.com" },
  { id: "msi", name: "MSI Gaming", category: "Laptops & Monitors", logoUrl: "/img/clients/msi.png", websiteUrl: "https://www.msi.com" },
  { id: "thermaltake", name: "Thermaltake", category: "Cases & Liquid Cooling", logoUrl: "/img/clients/thermaltake.png", websiteUrl: "https://www.thermaltake.com" },
  { id: "ucc", name: "UCC Bangladesh", category: "Hardware Distributor", logoUrl: "/img/clients/ucc.png", websiteUrl: "https://ucc-bd.com" },
  { id: "viewsonic", name: "ViewSonic Gaming", category: "High-Refresh Displays", logoUrl: "/img/clients/viewsonic.png", websiteUrl: "https://www.viewsonic.com" },
  { id: "zotac", name: "ZOTAC Gaming", category: "GeForce Graphics", logoUrl: "/img/clients/zotac.png", websiteUrl: "https://www.zotac.com" }
];

const communities = [
  { id: "ff-bangladesh", name: "FreeFire Community of Bangladesh", gameId: "free-fire", membersRank: 1000000, members: "1M+", tag: "OFFICIAL GROUP", link: "https://facebook.com/groups/esbd" },
  { id: "pubgm-bd", name: "PUBG Mobile Official Community Bangladesh", gameId: "pubg-mobile", membersRank: 500000, members: "500K+", tag: "OFFICIAL HUB", link: "https://facebook.com/groups/esbd" },
  { id: "efootball-bd", name: "eFootball Community Bangladesh", gameId: "efootball", membersRank: 500000, members: "500K+", tag: "FB ALLIANCE", link: "https://facebook.com/groups/esbd" },
  { id: "coc-bd", name: "Clash of Clan Community of Bangladesh", gameId: "clash-of-clans", membersRank: 300000, members: "300K+", tag: "COMMUNITY", link: "https://facebook.com/groups/esbd" },
  { id: "mlbb-bd", name: "Mobile Legends Bang Bang community Bangladesh", gameId: "mobile-legends", membersRank: 200000, members: "200K+", tag: "ARENA HUB", link: "https://facebook.com/groups/esbd" },
  { id: "valorant-bd-70k", name: "Valorant Community of Bangladesh", gameId: "valorant", membersRank: 70000, members: "70K+", tag: "VERIFIED DISCORD", link: "https://discord.gg/esbd" },
  { id: "valorant-bd-65k", name: "Valorant Community Bangladesh", gameId: "valorant", membersRank: 65000, members: "65K+", tag: "TOURNAMENT HUB", link: "https://discord.gg/esbd" },
  { id: "fifa-bd", name: "FIFA Players of Bangladesh", gameId: "ea-fc26", membersRank: 26000, members: "26K+", tag: "CONSOLE LEAGUE", link: "https://facebook.com/groups/esbd" },
  { id: "pubg-pc-bd", name: "PUBG Battlegrounds Community Bangladesh", gameId: "pubg-mobile", membersRank: 20000, members: "20K+", tag: "PC SQUAD", link: "https://facebook.com/groups/esbd" },
  { id: "marvel-rivals-bd", name: "Marvel Rivals Community Bangladesh", gameId: "valorant", membersRank: 20000, members: "20K+", tag: "HERO SHOOTER", link: "https://facebook.com/groups/esbd" },
  { id: "dota-bd", name: "DOTA Bangladesh", gameId: "cs2", membersRank: 20000, members: "20K+", tag: "MOBA GUILD", link: "https://facebook.com/groups/esbd" },
  { id: "dota2-bd", name: "DOTA 2 Community of Bangladesh", gameId: "cs2", membersRank: 15000, members: "15K+", tag: "STEAM HUB", link: "https://facebook.com/groups/esbd" },
  { id: "csgo-bd", name: "CS-Go Community Bangladesh", gameId: "cs2", membersRank: 11000, members: "11K+", tag: "TACTICAL FPS", link: "https://facebook.com/groups/esbd" },
  { id: "cod-wz-bd", name: "Call of Duty War Zone Bangladesh", gameId: "cod-mobile", membersRank: 3000, members: "3K+", tag: "WARZONE HUB", link: "https://facebook.com/groups/esbd" },
  { id: "ps4-xbox-bd", name: "PS4 & Xbox Community Bangladesh", gameId: "ea-fc26", membersRank: 15000, members: "15K+", tag: "CROSS-PLATFORM", link: "https://facebook.com/groups/esbd" },
  { id: "fifa-ps-bd", name: "FIFA PlayStation Community (Bangladesh)", gameId: "ea-fc26", membersRank: 10000, members: "10K+", tag: "PLAYSTATION", link: "https://facebook.com/groups/esbd" },
  { id: "ea-fifa-bd", name: "EA Sports FIFA Bangladesh", gameId: "ea-fc26", membersRank: 2000, members: "2K+", tag: "PRO PLAYERS", link: "https://facebook.com/groups/esbd" },
  { id: "fifa-pro-clubs-bd", name: "FIFA PRO CLUBS (BANGLADESH)", gameId: "ea-fc26", membersRank: 2000, members: "2K+", tag: "11v11 CLUBS", link: "https://facebook.com/groups/esbd" },
  { id: "afgc-bd", name: "Asian Football Gaming Championship - AFGC Bangladesh", gameId: "efootball", membersRank: 1000, members: "1K+", tag: "GLOBAL QUALIFIER", link: "https://facebook.com/groups/esbd" }
];

const milestones = [
  { id: "wcg-2012", year: "2012", title: "World Cyber Games (WCG) Bangladesh Representation", description: "Organized and represented Bangladesh at the pinnacle of global competitive gaming in Kunshan, China.", category: "Global Stage", imageUrl: "/img/events/wcg-2012.jpg" },
  { id: "esports-masters-2013", year: "2013", title: "National Esports Masters Arena", description: "Country-wide multi-title championship uniting top PC gaming clans in Dhaka.", category: "National LAN", imageUrl: "/img/events/esports-masters-2013.jpg" },
  { id: "iub-intra-2015", year: "2015", title: "IUB Intra University Esports Championship", description: "First sanctioned collegiate championship with official hardware sponsors.", category: "Collegiate", imageUrl: "/img/events/iub-intra-2015.jpg" },
  { id: "nsu-cybernauts-2016", year: "2016", title: "NSU Cybernauts Inter-University LAN", description: "Record-breaking campus LAN with 1,200+ competitors and national media coverage.", category: "Collegiate", imageUrl: "/img/events/nsu-cybernauts-2016.jpg" },
  { id: "afgc-2017", year: "2017", title: "Asian Football Gaming Championship Qualifier", description: "Sent the Bangladesh national champion to represent in the AFGC Finals in Bangkok.", category: "International", imageUrl: "/img/events/afgc-2017.jpg" },
  { id: "commonwealth-2022", year: "2022", title: "Commonwealth Esports Championship Representation", description: "Selected and fielded team Bangladesh at the Commonwealth Esports Championships in Birmingham.", category: "Global Stage", imageUrl: "/img/events/commonwealth-2022.jpg" },
  { id: "bali-2023", year: "2023", title: "IESF World Esports Championship Bali", description: "Official Bangladesh delegation in Bali for the global IESF showdown.", category: "World Stage", imageUrl: "/img/events/bali-2023.jpg" },
  { id: "valorant-cup-2024", year: "2024", title: "Valorant Bangladesh Champions Cup", description: "Sold-out LAN stage with 500,000 BDT prize pool, live broadcasted to 250K concurrents.", category: "Arena LAN", imageUrl: "/img/events/valorant-cup-2024.jpg" }
];

const gallery = [
  { id: "gal-1", title: "Championship Stage & LED Visuals", category: "Stage", imageUrl: "/img/gallery/arena-stage.jpg", eventName: "Valorant Champions Cup" },
  { id: "gal-2", title: "Live Crowd & Audience Waves", category: "Crowd", imageUrl: "/img/gallery/crowd.jpg", eventName: "Esports Masters Finals" },
  { id: "gal-3", title: "Grand Trophy & Medal Ceremony", category: "Awards", imageUrl: "/img/gallery/award.jpg", eventName: "National Championship" },
  { id: "gal-4", title: "50-Seat High-Performance LAN Hall", category: "LAN Hall", imageUrl: "/img/gallery/lan-hall.jpg", eventName: "NSU Cybernauts" },
  { id: "gal-5", title: "Broadcast Booth & Caster Setup", category: "Production", imageUrl: "/img/gallery/led-booth.jpg", eventName: "ESBD Live Studio" },
  { id: "gal-6", title: "Team Bangladesh at World Finals", category: "National Team", imageUrl: "/img/gallery/team-bali.jpg", eventName: "IESF World Championship Bali" }
];

const staff = [
  // LEADERSHIP / OUR TEAM
  {
    id: "sumit-s-ron",
    name: "SUMIT S RON",
    role: "CEO & Founder",
    kind: "team",
    avatarUrl: "/img/team/sumit-s-ron.jpg",
    imageUrl: "/img/team/sumit-s-ron.jpg",
    bio: "CEO & Founder of E-SPORTS BANGLADESH since 2012. Pioneer of national competitive gaming leagues, campus championship circuits, and national team representation on the global stage."
  },
  {
    id: "taksib-amin-khan",
    name: "TAKSIB AMIN KHAN",
    role: "COO",
    kind: "team",
    avatarUrl: "/img/team/taksib-amin-khan.jpg",
    imageUrl: "/img/team/taksib-amin-khan.jpg",
    bio: "Chief Operating Officer managing enterprise hardware partnerships, creator roster relations, and nationwide tournament event operations."
  },
  {
    id: "md-mahdiul-alam",
    name: "Md.Mahdiul Alam",
    role: "COO",
    kind: "team",
    avatarUrl: "/img/team/md-mahdiul-alam.jpg",
    imageUrl: "/img/team/md-mahdiul-alam.jpg",
    bio: "Chief Operating Officer directing 4K multi-stream arena broadcasting, stage visual engineering, and Commonwealth Esports Championships team operations."
  },
  {
    id: "gazi-rahman",
    name: "GAZI RAHMAN",
    role: "COO",
    kind: "team",
    avatarUrl: "/img/team/gazi-rahman.jpg",
    imageUrl: "/img/team/gazi-rahman.jpg",
    bio: "Chief Operating Officer overseeing tournament rulesets, live refereeing panels, anti-cheat validation, and national competitive integrity."
  },
  // ESBD TEAM AMBASSADORS
  {
    id: "md-shoikot-islam",
    name: "MD. SHOIKOT ISLAM",
    role: "ESBD Ambassador",
    handle: "ITZ KABBO",
    kind: "ambassador",
    avatarUrl: "/img/team/md-shoikot-islam.jpg",
    imageUrl: "/img/team/md-shoikot-islam.jpg",
    bio: "Official ESBD Team Ambassador & premier Free Fire creator uniting millions across Bangladesh's battle royale communities."
  },
  {
    id: "noyon-hossain",
    name: "NOYON HOSSAIN",
    role: "ESBD Ambassador",
    handle: "APOLLO GAMING",
    kind: "ambassador",
    avatarUrl: "/img/team/noyon-hossain.jpg",
    imageUrl: "/img/team/noyon-hossain.jpg",
    bio: "Official ESBD Team Ambassador representing Apollo Gaming, driving grassroots community tournaments and youth gamer development."
  },
  {
    id: "md-rayhan",
    name: "MD. RAYHAN",
    role: "ESBD Ambassador",
    handle: "HEADSHOT KING",
    kind: "ambassador",
    avatarUrl: "/img/team/md-rayhan.jpg",
    imageUrl: "/img/team/md-rayhan.jpg",
    bio: "Official ESBD Team Ambassador, celebrated as Headshot King for competitive sharpshooting and championship broadcast analysis."
  },
  {
    id: "md-tanvir-ahmed",
    name: "MD. TANVIR AHMED",
    role: "ESBD Ambassador",
    handle: "TIMEBURNERGG",
    kind: "ambassador",
    avatarUrl: "/img/team/md-tanvir-ahmed.jpg",
    imageUrl: "/img/team/md-tanvir-ahmed.jpg",
    bio: "Official ESBD Team Ambassador & veteran creator TimeBurnerGG, mentoring emerging competitive rosters and collegiate champions."
  }
];

const services = [
  {
    id: "ops",
    number: "01",
    title: "Tournament Operations & League Execution",
    description: "Turnkey tournament hosting for brands, publishers, and collegiate leagues with refereeing, server automation, and rule enforcement.",
    features: ["Automated Brackets & Anti-Cheat", "LAN & Online Hybrid Tournaments", "Real-Time Room Management", "Player Check-in & Disputes"]
  },
  {
    id: "broadcast",
    number: "02",
    title: "Broadcast Production & Live Stage Direction",
    description: "Broadcast-grade multi-stream production in 4K with AR graphics, dynamic replay systems, casters, and stadium LED video feeds.",
    features: ["Custom 3D Virtual Studios", "Caster & Analyst Desks", "Simulcast to YT, FB & Twitch", "Spectator HUD Customization"]
  },
  {
    id: "influencer",
    number: "03",
    title: "Influencer Marketing & Creator Networks",
    description: "Direct access to 50M+ combined gaming audience across Bangladesh through verified creator collaborations and live appearances.",
    features: ["Creator Roster Activation", "Sponsored Showmatches & Streams", "Live Event Meet & Greets", "ROI & Engagement Analytics"]
  },
  {
    id: "activations",
    number: "04",
    title: "Brand Activations & Expo Stadium Booths",
    description: "High-impact experiential marketing booths, experience zones, and campus tours designed to put products directly in gamers hands.",
    features: ["Interactive Gaming Pods", "Cosplay Competitions & Swag", "On-Ground Product Launches", "Lead & User Acquisition"]
  }
];

const leaderboard = [
  {
    userId: "u-lb-1",
    rank: 1,
    game: "Free Fire",
    gameId: "free-fire",
    teamName: "RedX Esports",
    ign: "RedX_Vampire",
    displayName: "Tanvir Vampire",
    city: "Dhaka",
    points: 2850,
    wins: 42,
    titles: 4,
    played: 50,
    matchesPlayed: 50,
    earningsBDT: "4,50,000",
    earningsMinor: 45000000,
    avatarUrl: "/img/influencers/mr-triple-r.jpg",
    badge: "Champion"
  },
  {
    userId: "u-lb-2",
    rank: 2,
    game: "Free Fire",
    gameId: "free-fire",
    teamName: "Team Legion BD",
    ign: "Legion_Ghost",
    displayName: "Rashed Ghost",
    city: "Chittagong",
    points: 2620,
    wins: 38,
    titles: 3,
    played: 50,
    matchesPlayed: 50,
    earningsBDT: "3,20,000",
    earningsMinor: 32000000,
    avatarUrl: "/img/influencers/itz-kabbo.jpg",
    badge: "Elite"
  },
  {
    userId: "u-lb-3",
    rank: 3,
    game: "Free Fire",
    gameId: "free-fire",
    teamName: "Apex Predators",
    ign: "Apex_Sniper",
    displayName: "Shohel Sniper",
    city: "Sylhet",
    points: 2410,
    wins: 34,
    titles: 2,
    played: 48,
    matchesPlayed: 48,
    earningsBDT: "2,40,000",
    earningsMinor: 24000000,
    avatarUrl: "/img/influencers/gaming-with-talha.jpg",
    badge: "Pro"
  },
  {
    userId: "u-lb-4",
    rank: 4,
    game: "Valorant",
    gameId: "valorant",
    teamName: "Velocity Gaming BD",
    ign: "Velocity_Aces",
    displayName: "Aces Rahman",
    city: "Dhaka",
    points: 2350,
    wins: 29,
    titles: 3,
    played: 35,
    matchesPlayed: 35,
    earningsBDT: "3,00,000",
    earningsMinor: 30000000,
    avatarUrl: "/img/influencers/gaming-with-zihad.jpg",
    badge: "Radiant"
  },
  {
    userId: "u-lb-5",
    rank: 5,
    game: "Valorant",
    gameId: "valorant",
    teamName: "Fatal Strike",
    ign: "Fatal_Kyro",
    displayName: "Kyro Ahmed",
    city: "Rajshahi",
    points: 2180,
    wins: 26,
    titles: 2,
    played: 35,
    matchesPlayed: 35,
    earningsBDT: "2,00,000",
    earningsMinor: 20000000,
    avatarUrl: "/img/influencers/roasted-gaming.jpg",
    badge: "Immortal"
  },
  {
    userId: "u-lb-6",
    rank: 6,
    game: "PUBG Mobile",
    gameId: "pubg-mobile",
    teamName: "A1 Esports BD",
    ign: "A1_Raider",
    displayName: "Raider Khan",
    city: "Dhaka",
    points: 2740,
    wins: 39,
    titles: 4,
    played: 45,
    matchesPlayed: 45,
    earningsBDT: "3,80,000",
    earningsMinor: 38000000,
    avatarUrl: "/img/influencers/sinister-plays.jpg",
    badge: "Conqueror"
  },
  {
    userId: "u-lb-7",
    rank: 7,
    game: "CS2",
    gameId: "cs2",
    teamName: "Dhaka Knights",
    ign: "DK_Headshot",
    displayName: "Headshot Hasan",
    city: "Khulna",
    points: 1980,
    wins: 24,
    titles: 2,
    played: 30,
    matchesPlayed: 30,
    earningsBDT: "1,80,000",
    earningsMinor: 18000000,
    avatarUrl: "/img/influencers/timeburnergg.jpg",
    badge: "Global"
  }
];

const news = [
  {
    id: "news-ffws-2026",
    slug: "ffws-2026-bangladesh-qualifiers",
    title: "FFWS 2026 Bangladesh National Qualifiers: 48 Elite Squads Set to Battle for Regional Slot",
    gameId: "free-fire",
    gameTitle: "Free Fire",
    category: "Championship",
    author: "ESBD Editorial Staff",
    readTime: "3 min read",
    publishedAt: "2026-09-28T18:00:00.000Z",
    summary: "The roadmap to the Free Fire World Series kicks off in Dhaka with 48 registered squads competing across online group stages and a sold-out LAN grand final.",
    imageUrl: "/img/games/free-fire.png",
    featured: true,
    content: "E-SPORTS BANGLADESH today officially unveiled the operational blueprint for the FFWS 2026 Bangladesh Qualifiers. Over 48 squads, verified through competitive ID checks and automated anti-cheat screenings, will lock horns over four weekends of non-stop Battle Royale action. Top performers advance directly to the South Asian Regional Finals. All matches will be broadcasted live in 1080p60 on ESBD YouTube and Facebook channels."
  },
  {
    id: "news-pmgc-2026",
    slug: "pmgc-south-asia-bangladesh-roster",
    title: "PMGC South Asia Prelims: Bangladesh National Contenders Confirm Active Starting Roster",
    gameId: "pubg-mobile",
    gameTitle: "PUBG Mobile",
    category: "Roster News",
    author: "Gazi Rahman",
    readTime: "4 min read",
    publishedAt: "2026-09-27T14:30:00.000Z",
    summary: "Leading PUBG Mobile organizations in Bangladesh finalize their tactical rosters ahead of the high-stakes South Asia Prelims hosted under ESBD officiating.",
    imageUrl: "/img/games/pubg-mobile.png",
    featured: true,
    content: "With the international competitive window fast approaching, Bangladesh's top 16 PUBG Mobile teams have locked their official starting lineups. ESBD tournament referees have validated player credentials, ensuring zero emulator infringements and compliance with PMGC standard operating rules. Erangel and Miramar rotations will determine the top two teams representing Bangladesh internationally."
  },
  {
    id: "news-valorant-cup",
    slug: "valorant-champions-cup-bangladesh-2026",
    title: "Valorant Champions Cup 2026: 500,000 BDT Prize Pool Announced with Vanguard LAN Setup",
    gameId: "valorant",
    gameTitle: "Valorant",
    category: "Tournament Alert",
    author: "Sumit S Ron",
    readTime: "3 min read",
    publishedAt: "2026-09-26T12:00:00.000Z",
    summary: "Registration opens for the 500,000 BDT Valorant Champions Cup, featuring dedicated high-tick tournament servers and official Riot Vanguard hardware validation.",
    imageUrl: "/img/games/valorant.png",
    featured: true,
    content: "Tactical FPS enthusiasts have a new benchmark to aim for as ESBD announces the Valorant Champions Cup 2026. Armed with a 500,000 BDT prize pool, the competition welcomes teams from universities, amateur leagues, and pro clans. The LAN playoffs will take place on dedicated 128-tick tournament clients powered by ASUS ROG and ZOTAC Gaming rigs."
  },
  {
    id: "news-cs2-major",
    slug: "esbd-cs2-autumn-major-lan",
    title: "ESBD CS2 Autumn Major LAN: 120-FPS Arena Matchups & Server Specs Detailed",
    gameId: "cs2",
    gameTitle: "CS2",
    category: "LAN Event",
    author: "Md. Mahdiul Alam",
    readTime: "2 min read",
    publishedAt: "2026-09-25T16:00:00.000Z",
    summary: "Dhaka's premier Counter-Strike 2 clans prepare for an intensive MR12 bracket executed inside the ESBD 50-Seat High-Performance LAN Hall.",
    imageUrl: "/img/games/cs2.png",
    featured: false,
    content: "The ESBD CS2 Autumn Major returns to Dhaka's premier LAN stadium. Featuring strict sub-tick consistency, high-refresh 240Hz ViewSonic ELITE monitors, and soundproof tournament booths, this tournament represents the absolute pinnacle of PC esports production in Bangladesh."
  },
  {
    id: "news-afgc-trials",
    slug: "efootball-afgc-bangkok-trials-commence",
    title: "Asian Football Gaming Championship (AFGC): National Trials Commencing for Bangkok Finals",
    gameId: "efootball",
    gameTitle: "eFootball",
    category: "Global Qualifier",
    author: "Taksib Amin Khan",
    readTime: "3 min read",
    publishedAt: "2026-09-24T11:00:00.000Z",
    summary: "Following Bangladesh's historic AFGC legacy since 2017, ESBD opens nationwide 1v1 console & mobile trials to select the national champion.",
    imageUrl: "/img/games/efootball.png",
    featured: false,
    content: "ESBD is proud to reignite the national qualification campaign for the Asian Football Gaming Championship (AFGC). Console and cross-platform competitors will face off in rigorous double-elimination brackets. The champion will receive full flight sponsorships, accommodation, and official jersey kits for the Bangkok Asian showdown."
  },
  {
    id: "news-mlbb-super-league",
    slug: "mlbb-dhaka-super-league-32-clans",
    title: "MLBB Dhaka Super League: 32 Clans Locked for Championship Bracket",
    gameId: "mobile-legends",
    gameTitle: "Mobile Legends",
    category: "MOBA League",
    author: "ESBD Editorial Staff",
    readTime: "2 min read",
    publishedAt: "2026-09-23T19:00:00.000Z",
    summary: "Mobile Legends Bang Bang community in Bangladesh reaches unprecedented heights as 32 verified clans enter the official draft pick playoffs.",
    imageUrl: "/img/games/mobile-legends.png",
    featured: false,
    content: "With over 200,000 active community members in Bangladesh, MLBB continues its explosive ascent. The Dhaka Super League introduces a multi-tier draft format with professional caster analysis and MVP leaderboards on the ESBD portal."
  },
  {
    id: "news-marvel-rivals",
    slug: "marvel-rivals-esbd-invitational",
    title: "Marvel Rivals Competitive Debut in Bangladesh: Closed Stage Invitational Announced",
    gameId: "valorant",
    gameTitle: "Marvel Rivals",
    category: "New Title",
    author: "Sumit S Ron",
    readTime: "3 min read",
    publishedAt: "2026-09-22T15:00:00.000Z",
    summary: "ESBD expands its roster of official tournament titles with the Marvel Rivals Bangladesh Invitational, uniting 20K+ enthusiastic players.",
    imageUrl: "/img/games/valorant.png",
    featured: false,
    content: "In response to phenomenal grassroots demand from 20,000+ local players, ESBD is launching the inaugural Marvel Rivals Community Cup. Hero bans, dynamic environment destruction, and fast-paced 6v6 synergies will be streamed live from the ESBD studio."
  },
  {
    id: "news-hardware-expo",
    slug: "hardware-expo-asus-aorus-partnership",
    title: "ASUS ROG & Gigabyte AORUS Partner with ESBD to Equip Pro Tournament LAN Arenas",
    gameId: "hardware",
    gameTitle: "Hardware & Gear",
    category: "Partnership",
    author: "Taksib Amin Khan",
    readTime: "3 min read",
    publishedAt: "2026-09-21T10:00:00.000Z",
    summary: "Official hardware distributors bring 540Hz displays, RTX 4080 Super rigs, and tournament mechanical keyboards to competitive players in Bangladesh.",
    imageUrl: "/img/clients/asus.png",
    featured: true,
    content: "E-SPORTS BANGLADESH has solidified strategic hardware partnerships with ASUS ROG, Gigabyte AORUS, MSI, Thermaltake, ViewSonic, ZOTAC, and UCC Bangladesh. The deal ensures that all sanctioned national qualifiers and LAN stages feature certified esports-grade peripherals, giving players equal hardware footing."
  }
];

const products = [
  {
    id: "prod-rog-pg248qp",
    name: "ASUS ROG Swift Pro PG248QP 540Hz Gaming Display",
    brand: "ASUS ROG",
    brandLogo: "/img/clients/asus.png",
    category: "Monitors",
    categoryName: "Displays & Monitors",
    priceBDT: 115000,
    priceDisplay: "৳ 1,15,000",
    tournamentApproved: true,
    tournamentRole: "Official LAN Stage Display",
    specs: ["540Hz (OC) Esports-TN Panel", "0.2ms Response Time", "NVIDIA G-SYNC & Reflex Analyzer", "Ultra-Slim Ergonomic Stand"],
    description: "The official stage display for ESBD CS2 and Valorant National Championships. Engineered for zero motion blur and lightning-fast pixel transitions.",
    inStock: true,
    stockCount: 14,
    imageUrl: "/img/clients/asus.png"
  },
  {
    id: "prod-rog-azoth",
    name: "ASUS ROG Azoth Wireless 75% Custom Gaming Keyboard",
    brand: "ASUS ROG",
    brandLogo: "/img/clients/asus.png",
    category: "Keyboards",
    categoryName: "Keyboards & Switches",
    priceBDT: 29500,
    priceDisplay: "৳ 29,500",
    tournamentApproved: true,
    tournamentRole: "Official Tournament Mechanical Keyboard",
    specs: ["Silicone Gasket Mount & 3 Dampening Layers", "ROG NX Pre-lubed Mechanical Switches", "OLED Smart Display & 3-Way Knob", "Tri-Mode 2.4GHz SpeedNova Wireless"],
    description: "Tournament-certified mechanical keyboard offering unmatched acoustic feedback, rapid response times, and customizable OLED status display.",
    inStock: true,
    stockCount: 22,
    imageUrl: "/img/clients/asus.png"
  },
  {
    id: "prod-rog-harpe-ace",
    name: "ASUS ROG Harpe Ace Aim Lab Edition Ultralight Mouse",
    brand: "ASUS ROG",
    brandLogo: "/img/clients/asus.png",
    category: "Mice",
    categoryName: "Gaming Mice & Mats",
    priceBDT: 16500,
    priceDisplay: "৳ 16,500",
    tournamentApproved: true,
    tournamentRole: "Official Pro FPS Mouse",
    specs: ["54-Gram Ultra-Lightweight Factor", "AimPoint 36,000 DPI Optical Sensor", "SpeedNova Zero-Latency Wireless", "Aim Lab Settings Optimizer"],
    description: "Developed alongside esports professionals to provide pixel-precise tracking for tactical shooters and battle royale champions.",
    inStock: true,
    stockCount: 35,
    imageUrl: "/img/clients/asus.png"
  },
  {
    id: "prod-aorus-rtx4080s",
    name: "Gigabyte AORUS GeForce RTX 4080 SUPER Master 16G",
    brand: "Gigabyte AORUS",
    brandLogo: "/img/clients/gigabyte.png",
    category: "Rigs",
    categoryName: "Components & Rigs",
    priceBDT: 168000,
    priceDisplay: "৳ 1,68,000",
    tournamentApproved: true,
    tournamentRole: "Official Tournament Rig GPU",
    specs: ["16GB GDDR6X 256-bit Memory", "WINDFORCE Bionic Shark Fans", "LCD Edge View Real-Time Monitor", "Dual BIOS Extreme Cooling"],
    description: "Powers the primary broadcast rigs and spectator observation cameras at ESBD LAN arenas, guaranteeing consistent 360+ FPS.",
    inStock: true,
    stockCount: 8,
    imageUrl: "/img/clients/gigabyte.png"
  },
  {
    id: "prod-msi-raider-ge78",
    name: "MSI Raider GE78 HX 14V Tournament Esports Laptop",
    brand: "MSI Gaming",
    brandLogo: "/img/clients/msi.png",
    category: "Rigs",
    categoryName: "Components & Rigs",
    priceBDT: 345000,
    priceDisplay: "৳ 3,45,000",
    tournamentApproved: true,
    tournamentRole: "Official Caster & Analyst Rig",
    specs: ["Intel Core i9-14900HX Processor", "NVIDIA GeForce RTX 4090 16GB", "17-Inch QHD+ 240Hz 100% DCI-P3", "Cooler Boost 5 Vapor Chamber"],
    description: "The mobile powerhouse utilized by ESBD live casters, match observers, and travelling national team players.",
    inStock: true,
    stockCount: 5,
    imageUrl: "/img/clients/msi.png"
  },
  {
    id: "prod-viewsonic-xg270",
    name: "ViewSonic ELITE XG270 240Hz 1ms Fast IPS Monitor",
    brand: "ViewSonic Gaming",
    brandLogo: "/img/clients/viewsonic.png",
    category: "Monitors",
    categoryName: "Displays & Monitors",
    priceBDT: 48500,
    priceDisplay: "৳ 48,500",
    tournamentApproved: true,
    tournamentRole: "Collegiate & Arena LAN Display",
    specs: ["27-inch 1080p Fast IPS Display", "240Hz Refresh Rate with PureXP Blur Reduction", "G-Sync Compatible Certified", "Integrated Mouse Bungee & Headphone Hook"],
    description: "High-refresh workhorse of Bangladesh's collegiate esports tournaments, offering vibrant colors and zero ghosting.",
    inStock: true,
    stockCount: 20,
    imageUrl: "/img/clients/viewsonic.png"
  },
  {
    id: "prod-thermaltake-argent",
    name: "Thermaltake Argent E700 Real Leather Ergonomic Chair",
    brand: "Thermaltake",
    brandLogo: "/img/clients/thermaltake.png",
    category: "Chairs",
    categoryName: "Ergonomics & Chairs",
    priceBDT: 145000,
    priceDisplay: "৳ 1,45,000",
    tournamentApproved: true,
    tournamentRole: "Official Main Stage Gaming Chair",
    specs: ["Designed by Studio F. A. Porsche", "Genuine Perforated Real Leather", "Side Racing Handles for Height/Tilt", "Class 4 Heavy-Duty Gas Spring"],
    description: "The official throne gracing the Grand Final main stages of ESBD championships, providing unparalleled lumbar support during marathon series.",
    inStock: true,
    stockCount: 12,
    imageUrl: "/img/clients/thermaltake.png"
  },
  {
    id: "prod-thermaltake-ram",
    name: "Thermaltake TOUGHRAM RGB D5 32GB (2x16GB) 6000MHz",
    brand: "Thermaltake",
    brandLogo: "/img/clients/thermaltake.png",
    category: "Rigs",
    categoryName: "Components & Rigs",
    priceBDT: 18500,
    priceDisplay: "৳ 18,500",
    tournamentApproved: true,
    tournamentRole: "Tournament Server Memory",
    specs: ["6000MHz High-Speed DDR5", "Intel XMP 3.0 & AMD EXPO Ready", "10 Super-Bright Addressable LEDs", "Tight Latency Timings"],
    description: "High-stability memory chosen for low-latency tournament server nodes and production workstations.",
    inStock: true,
    stockCount: 30,
    imageUrl: "/img/clients/thermaltake.png"
  },
  {
    id: "prod-zotac-4070ti",
    name: "ZOTAC Gaming GeForce RTX 4070 Ti SUPER Trinity Black",
    brand: "ZOTAC Gaming",
    brandLogo: "/img/clients/zotac.png",
    category: "Rigs",
    categoryName: "Components & Rigs",
    priceBDT: 118000,
    priceDisplay: "৳ 1,18,000",
    tournamentApproved: true,
    tournamentRole: "Arena Pods Official GPU",
    specs: ["16GB GDDR6X 256-bit", "IceStorm 2.0 Advanced Cooling", "FREEZE Fan Stop & Active Fan Control", "SPECTRA 2.0 RGB Lighting"],
    description: "Equips the 50-seat high-performance LAN hall, ensuring seamless 1440p high-refresh tournament performance across every title.",
    inStock: true,
    stockCount: 16,
    imageUrl: "/img/clients/zotac.png"
  },
  {
    id: "prod-ucc-clan-bundle",
    name: "UCC Bangladesh Official Esports Clan Battle Station Bundle",
    brand: "UCC Bangladesh",
    brandLogo: "/img/clients/ucc.png",
    category: "Bundles",
    categoryName: "Official Bundles",
    priceBDT: 72000,
    priceDisplay: "৳ 72,000",
    tournamentApproved: true,
    tournamentRole: "Official Esports Club Startup Kit",
    specs: ["240Hz Gaming Display Included", "Optical Tournament Mouse & Mech Keyboard", "Noise-Cancelling Studio Headset", "Heavy-Duty Cordura Desk Pad"],
    description: "Complete hardware bundle offered by UCC Bangladesh exclusively for registered ESBD teams, gaming cafes, and university clubs.",
    inStock: true,
    stockCount: 18,
    imageUrl: "/img/clients/ucc.png"
  }
];

module.exports = {
  games,
  tournaments,
  stats,
  influencers,
  clients,
  communities,
  milestones,
  gallery,
  staff,
  services,
  leaderboard,
  news,
  products
};

