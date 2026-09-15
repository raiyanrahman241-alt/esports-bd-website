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
  { id: "ff-bangladesh", name: "Free Fire Bangladesh Official", gameId: "free-fire", membersRank: 980000, members: "980K", tag: "COMMUNITY", link: "https://facebook.com/groups/esbd" },
  { id: "pubgm-bd", name: "PUBG Mobile Bangladesh Hub", gameId: "pubg-mobile", membersRank: 740000, members: "740K", tag: "DISCORD / FB", link: "https://facebook.com/groups/esbd" },
  { id: "valorant-bd", name: "Valorant Community Bangladesh", gameId: "valorant", membersRank: 260000, members: "260K", tag: "VERIFIED DISCORD", link: "https://discord.gg/esbd" },
  { id: "cs2-bd", name: "Counter-Strike 2 Bangladesh", gameId: "cs2", membersRank: 150000, members: "150K", tag: "STEAM GROUP", link: "https://steamcommunity.com/groups/esbd" },
  { id: "efootball-bd", name: "eFootball PES BD Alliance", gameId: "efootball", membersRank: 120000, members: "120K", tag: "FB ALLIANCE", link: "https://facebook.com/groups/esbd" },
  { id: "mlbb-bd", name: "Mobile Legends Bangladesh Arena", gameId: "mobile-legends", membersRank: 190000, members: "190K", tag: "COMMUNITY", link: "https://facebook.com/groups/esbd" }
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
  { id: "md-tanvir-ahmed", name: "Md Tanvir Ahmed", role: "Founder & Chief Executive Officer", kind: "team", avatarUrl: "/img/team/md-tanvir-ahmed.jpg", bio: "Pioneered institutional esports in Bangladesh since 2012, spearheading national tournaments and global representations." },
  { id: "gazi-rahman", name: "Gazi Rahman", role: "Head of Esports Operations & Tournaments", kind: "team", avatarUrl: "/img/team/gazi-rahman.jpg", bio: "Over a decade of refereeing and directing major LAN arenas, campus cups, and national qualifier broadcasts." },
  { id: "md-mahdiul-alam", name: "Md Mahdiul Alam", role: "Chief Broadcast & Production Director", kind: "team", avatarUrl: "/img/team/md-mahdiul-alam.jpg", bio: "Lead technical director behind high-bandwidth multi-camera esports productions and stadium visual mapping." },
  { id: "taksib-amin-khan", name: "Taksib Amin Khan", role: "Talent & Creator Partnerships Lead", kind: "team", avatarUrl: "/img/team/taksib-amin-khan.jpg", bio: "Manages relationships across 80+ elite content creators, brand deals, and influencer activations." },
  { id: "sumit-s-ron", name: "Sumit S Ron", role: "Senior Tournament Admin & Integrity Lead", kind: "team", avatarUrl: "/img/team/sumit-s-ron.jpg", bio: "Specialist in bracket automation, competitive integrity, and anti-cheat enforcement across all game titles." },
  { id: "noyon-hossain", name: "Noyon Hossain", role: "Community & University League Manager", kind: "team", avatarUrl: "/img/team/noyon-hossain.jpg", bio: "Overseeing 40+ university gaming clubs and grassroots community engagement across 8 divisions." }
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
  leaderboard
};
