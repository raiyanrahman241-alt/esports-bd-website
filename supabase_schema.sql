-- =============================================================================
-- E-SPORTS BANGLADESH (ESBD) - Production Supabase PostgreSQL Schema
-- Tournament Platform, Player Portal, Live Brackets, Admin Operations
-- =============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    phone TEXT,
    ign TEXT NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'organizer', 'admin')),
    avatar_url TEXT DEFAULT '/img/esbd-logo.png',
    wallet_balance_minor BIGINT NOT NULL DEFAULT 0, -- Stored in BDT Poisha (1 BDT = 100 Poisha)
    game_tags JSONB DEFAULT '{}'::jsonb,
    age_bracket TEXT DEFAULT 'above_18' CHECK (age_bracket IN ('above_18', 'below_18')),
    nid_number TEXT,
    nid_attachment_url TEXT,
    birth_certificate_no TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GAMES
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    name TEXT NOT NULL,
    genre TEXT NOT NULL,
    platform TEXT NOT NULL,
    banner_url TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    rules_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TOURNAMENTS
CREATE TABLE IF NOT EXISTS public.tournaments (
    id TEXT PRIMARY KEY DEFAULT ('esbd-' || substr(uuid_generate_v4()::text, 1, 8)),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    game_id TEXT REFERENCES public.games(id) ON DELETE SET NULL,
    format TEXT NOT NULL DEFAULT 'Single Elimination', -- 'Single Elimination', 'Double Elimination', 'Battle Royale (Squad)'
    status TEXT NOT NULL DEFAULT 'registration_open' CHECK (status IN ('draft', 'registration_open', 'check_in_open', 'live', 'completed', 'cancelled')),
    prize_pool_minor BIGINT NOT NULL DEFAULT 5000000, -- 50,000 BDT default
    currency TEXT NOT NULL DEFAULT 'BDT',
    entry_fee_minor BIGINT NOT NULL DEFAULT 0, -- Free entry
    sponsor TEXT DEFAULT 'ESBD & Partners',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    max_slots INTEGER NOT NULL DEFAULT 64,
    registered_count INTEGER NOT NULL DEFAULT 0,
    banner_url TEXT,
    rules JSONB DEFAULT '["Must be a resident of Bangladesh.", "Official anti-cheat and Discord check-in required.", "Room IDs shared 15 mins before match schedule."]'::jsonb,
    bracket_data JSONB DEFAULT '{"rounds": []}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY DEFAULT ('team-' || substr(uuid_generate_v4()::text, 1, 8)),
    name TEXT NOT NULL,
    tag TEXT NOT NULL,
    game_id TEXT REFERENCES public.games(id) ON DELETE CASCADE,
    captain_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id TEXT REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ign TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'starter' CHECK (role IN ('captain', 'starter', 'substitute')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 6. TOURNAMENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
    team_name TEXT,
    ign TEXT,
    age_bracket TEXT NOT NULL DEFAULT 'above_18' CHECK (age_bracket IN ('above_18', 'below_18')),
    tournament_tier TEXT NOT NULL DEFAULT 'national' CHECK (tournament_tier IN ('national', 'international')),
    nid_number TEXT,
    nid_attachment_url TEXT,
    birth_certificate_no TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_nid TEXT,
    payment_method TEXT DEFAULT 'free_pass',
    payment_trx_id TEXT,
    payment_phone TEXT,
    contact_phone TEXT,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'checked_in', 'withdrawn', 'disqualified')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    checked_in_at TIMESTAMPTZ,
    UNIQUE(tournament_id, user_id)
);

-- 7. MATCHES & BRACKET PROGRESSION
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY DEFAULT ('match-' || substr(uuid_generate_v4()::text, 1, 8)),
    tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE CASCADE,
    round_name TEXT NOT NULL DEFAULT 'Round 1',
    round_index INTEGER NOT NULL DEFAULT 1,
    match_index INTEGER NOT NULL DEFAULT 1,
    participant_a_name TEXT NOT NULL DEFAULT 'TBD',
    participant_a_id TEXT,
    participant_b_name TEXT NOT NULL DEFAULT 'TBD',
    participant_b_id TEXT,
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    winner_id TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'disputed')),
    room_code TEXT,
    room_password TEXT,
    scheduled_at TIMESTAMPTZ,
    proof_url TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WALLET TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount_minor BIGINT NOT NULL, -- positive for credit, negative for debit
    currency TEXT NOT NULL DEFAULT 'BDT',
    type TEXT NOT NULL CHECK (type IN ('top_up', 'entry_fee', 'payout', 'refund', 'reward')),
    method TEXT DEFAULT 'bkash' CHECK (method IN ('bkash', 'nagad', 'rocket', 'bank', 'system')),
    reference TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'tournament' CHECK (type IN ('tournament', 'match', 'room_code', 'wallet', 'admin', 'dispute')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. LEADERBOARDS
CREATE TABLE IF NOT EXISTS public.leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id TEXT REFERENCES public.games(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    team_name TEXT,
    player_ign TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    matches_played INTEGER NOT NULL DEFAULT 0,
    earnings_minor BIGINT NOT NULL DEFAULT 0,
    avatar_url TEXT,
    badge TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INFLUENCERS & CREATORS
CREATE TABLE IF NOT EXISTS public.influencers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    handle TEXT NOT NULL,
    followers_rank BIGINT NOT NULL DEFAULT 0,
    followers_display TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'macro', -- 'mega', 'macro', 'rising'
    platforms JSONB DEFAULT '["YouTube", "Facebook"]'::jsonb,
    featured BOOLEAN DEFAULT true
);

-- 12. CLIENTS & SPONSORS
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Hardware & Peripherals',
    logo_url TEXT NOT NULL,
    website_url TEXT,
    featured BOOLEAN DEFAULT true
);

-- 13. COMMUNITIES
CREATE TABLE IF NOT EXISTS public.communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    game_id TEXT,
    members_rank INTEGER NOT NULL DEFAULT 0,
    members TEXT NOT NULL,
    tag TEXT NOT NULL,
    link TEXT
);

-- 14. MILESTONES & TIMELINE
CREATE TABLE IF NOT EXISTS public.milestones (
    id TEXT PRIMARY KEY,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT
);

-- 15. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    event_name TEXT
);

-- 16. STAFF & LEADERSHIP
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'team' CHECK (kind IN ('team', 'ambassador')),
    avatar_url TEXT NOT NULL,
    bio TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    order_index INTEGER DEFAULT 0
);

-- 17. AGENCY SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    order_index INTEGER DEFAULT 0
);

-- 18. PLATFORM STATS
CREATE TABLE IF NOT EXISTS public.stats (
    id TEXT PRIMARY KEY,
    total_players INTEGER NOT NULL DEFAULT 85000,
    total_projects INTEGER NOT NULL DEFAULT 1200,
    lan_executions INTEGER NOT NULL DEFAULT 200,
    total_prize_minor BIGINT NOT NULL DEFAULT 1500000000, -- 1.5 Crore BDT
    audience_reached TEXT NOT NULL DEFAULT '2M+',
    companies_served INTEGER NOT NULL DEFAULT 100,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. CONTACT & SPONSORSHIP INQUIRIES
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'replied', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. DISPUTES & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.disputes (
    id TEXT PRIMARY KEY DEFAULT ('disp-' || substr(uuid_generate_v4()::text, 1, 8)),
    match_id TEXT REFERENCES public.matches(id) ON DELETE CASCADE,
    tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE CASCADE,
    raised_by_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'rejected')),
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.match_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id TEXT REFERENCES public.matches(id) ON DELETE CASCADE,
    submitted_by_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    my_score INTEGER NOT NULL,
    opponent_score INTEGER NOT NULL,
    proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'disputed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. NEWSROOM (Game News, Tournament Portals & Esports Coverage)
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY DEFAULT ('news-' || substr(uuid_generate_v4()::text, 1, 8)),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    game_id TEXT REFERENCES public.games(id) ON DELETE SET NULL,
    game_name TEXT,
    author TEXT NOT NULL DEFAULT 'ESBD Editorial Team',
    author_role TEXT DEFAULT 'Staff Writer',
    author_avatar TEXT DEFAULT '/img/esbd-logo.png',
    image_url TEXT,
    read_time TEXT DEFAULT '3 min read',
    tags JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. SHOP PRODUCTS (Gaming Hardware, Peripherals & Tournament Gear)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(uuid_generate_v4()::text, 1, 8)),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price_bdt NUMERIC(12,2) NOT NULL,
    original_price_bdt NUMERIC(12,2),
    discount_pct INTEGER DEFAULT 0,
    rating NUMERIC(2,1) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    is_tournament_grade BOOLEAN DEFAULT true,
    sponsor_tier TEXT DEFAULT 'Official Partner',
    image_url TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. PRODUCT ORDERS
CREATE TABLE IF NOT EXISTS public.product_orders (
    id TEXT PRIMARY KEY DEFAULT ('ord-' || substr(uuid_generate_v4()::text, 1, 8)),
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Dhaka',
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price_bdt NUMERIC(12,2) NOT NULL,
    total_amount_bdt NUMERIC(12,2) NOT NULL,
    payment_method TEXT NOT NULL,
    trx_id TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SEED DATA (High Fidelity Bangladesh Esports Records)
-- =============================================================================

-- GAMES
INSERT INTO public.games (id, slug, title, name, genre, platform, banner_url, icon_url) VALUES
('free-fire', 'free-fire', 'Free Fire', 'Garena Free Fire', 'Battle Royale', 'Mobile', '/img/games/free-fire.png', '/img/games/free-fire.png'),
('pubg-mobile', 'pubg-mobile', 'PUBG Mobile', 'PUBG Mobile', 'Battle Royale', 'Mobile', '/img/games/pubg-mobile.png', '/img/games/pubg-mobile.png'),
('valorant', 'valorant', 'Valorant', 'Valorant', 'Tactical FPS', 'PC', '/img/games/valorant.png', '/img/games/valorant.png'),
('cs2', 'cs2', 'CS2', 'Counter-Strike 2', 'Tactical FPS', 'PC', '/img/games/cs2.png', '/img/games/cs2.png'),
('efootball', 'efootball', 'eFootball', 'eFootball 2026', 'Sports Simulation', 'Cross-Platform', '/img/games/efootball.png', '/img/games/efootball.png'),
('mobile-legends', 'mobile-legends', 'Mobile Legends', 'Mobile Legends: Bang Bang', 'MOBA', 'Mobile', '/img/games/mobile-legends.png', '/img/games/mobile-legends.png'),
('honor-of-kings', 'honor-of-kings', 'Honor of Kings', 'Honor of Kings', 'MOBA', 'Mobile', '/img/games/honor-of-kings.png', '/img/games/honor-of-kings.png'),
('cod-mobile', 'cod-mobile', 'Call of Duty: Mobile', 'Call of Duty: Mobile', 'FPS', 'Mobile', '/img/games/cod-mobile.png', '/img/games/cod-mobile.png')
ON CONFLICT (id) DO NOTHING;

-- STATS
INSERT INTO public.stats (id, total_players, total_projects, lan_executions, total_prize_minor, audience_reached, companies_served) VALUES
('esbd-stats', 85000, 1240, 215, 2500000000, '2.5M+', 115)
ON CONFLICT (id) DO UPDATE SET
    total_players = EXCLUDED.total_players,
    total_projects = EXCLUDED.total_projects,
    lan_executions = EXCLUDED.lan_executions,
    total_prize_minor = EXCLUDED.total_prize_minor;

-- CLIENTS
INSERT INTO public.clients (id, name, category, logo_url, website_url) VALUES
('asus', 'ASUS Republic of Gamers', 'Hardware & Peripherals', '/img/clients/asus.png', 'https://rog.asus.com'),
('gigabyte', 'Gigabyte AORUS', 'Motherboards & GPUs', '/img/clients/gigabyte.png', 'https://www.aorus.com'),
('msi', 'MSI Gaming', 'Laptops & Monitors', '/img/clients/msi.png', 'https://www.msi.com'),
('thermaltake', 'Thermaltake', 'Cases & Liquid Cooling', '/img/clients/thermaltake.png', 'https://www.thermaltake.com'),
('ucc', 'UCC Bangladesh', 'Hardware Distributor', '/img/clients/ucc.png', 'https://ucc-bd.com'),
('viewsonic', 'ViewSonic Gaming', 'High-Refresh Displays', '/img/clients/viewsonic.png', 'https://www.viewsonic.com'),
('zotac', 'ZOTAC Gaming', 'GeForce Graphics', '/img/clients/zotac.png', 'https://www.zotac.com')
ON CONFLICT (id) DO NOTHING;

-- INFLUENCERS
INSERT INTO public.influencers (id, name, handle, followers_rank, followers_display, avatar_url, category, platforms) VALUES
('mr-triple-r', 'MrTripleR', '@mrtripler', 5800000, '5.8M', '/img/influencers/mr-triple-r.jpg', 'mega', '["YouTube", "Facebook"]'),
('itz-kabbo', 'Itz Kabbo', '@itzkabbo', 4200000, '4.2M', '/img/influencers/itz-kabbo.jpg', 'mega', '["YouTube", "Facebook", "Instagram"]'),
('gaming-with-talha', 'Gaming With Talha', '@gamingwithtalha', 2900000, '2.9M', '/img/influencers/gaming-with-talha.jpg', 'macro', '["YouTube", "Facebook"]'),
('gaming-with-zihad', 'Gaming with Zihad', '@gamingwithzihad', 2400000, '2.4M', '/img/influencers/gaming-with-zihad.jpg', 'macro', '["YouTube", "Facebook"]'),
('roasted-gaming', 'Roasted Gaming BD', '@roastedgamingbd', 1800000, '1.8M', '/img/influencers/roasted-gaming.jpg', 'macro', '["YouTube"]'),
('timeburnergg', 'TimeBurner GG', '@timeburnergg', 950000, '950K', '/img/influencers/timeburnergg.jpg', 'macro', '["YouTube", "Twitch"]'),
('sinister-plays', 'Sinister Plays', '@sinisterplays', 680000, '680K', '/img/influencers/sinister-plays.jpg', 'macro', '["YouTube"]'),
('arpon-plays-yt', 'Arpon Plays', '@arponplays', 430000, '430K', '/img/influencers/arpon-plays-yt.jpg', 'rising', '["YouTube"]'),
('rzjax-gaming', 'Rzjax Gaming', '@rzjaxgaming', 320000, '320K', '/img/influencers/rzjax-gaming.jpg', 'rising', '["YouTube"]'),
('apollo-gaming', 'Apollo Gaming', '@apollogaming', 280000, '280K', '/img/influencers/apollo-gaming.jpg', 'rising', '["YouTube"]')
ON CONFLICT (id) DO NOTHING;

-- COMMUNITIES
INSERT INTO public.communities (id, name, game_id, members_rank, members, tag, link) VALUES
('ff-bangladesh', 'Free Fire Bangladesh Official', 'free-fire', 980000, '980K', 'COMMUNITY', 'https://facebook.com/groups/esbd'),
('pubgm-bd', 'PUBG Mobile Bangladesh Hub', 'pubgm-mobile', 740000, '740K', 'DISCORD / FB', 'https://facebook.com/groups/esbd'),
('valorant-bd', 'Valorant Community Bangladesh', 'valorant', 260000, '260K', 'VERIFIED DISCORD', 'https://discord.gg/esbd'),
('cs2-bd', 'Counter-Strike 2 Bangladesh', 'cs2', 150000, '150K', 'STEAM GROUP', 'https://steamcommunity.com/groups/esbd'),
('efootball-bd', 'eFootball PES BD Alliance', 'efootball', 120000, '120K', 'FB ALLIANCE', 'https://facebook.com/groups/esbd'),
('mlbb-bd', 'Mobile Legends Bangladesh Arena', 'mobile-legends', 190000, '190K', 'COMMUNITY', 'https://facebook.com/groups/esbd')
ON CONFLICT (id) DO NOTHING;

-- STAFF & LEADERSHIP
INSERT INTO public.staff (id, name, role, kind, avatar_url, bio, order_index) VALUES
('sumit-s-ron', 'SUMIT S RON', 'CEO & Founder', 'team', '/img/team/sumit-s-ron.jpg', 'CEO & Founder of E-SPORTS BANGLADESH since 2012. Pioneer of national competitive gaming leagues, campus championship circuits, and national team representation on the global stage.', 1),
('taksib-amin-khan', 'TAKSIB AMIN KHAN', 'COO', 'team', '/img/team/taksib-amin-khan.jpg', 'Chief Operating Officer managing enterprise hardware partnerships, creator roster relations, and nationwide tournament event operations.', 2),
('md-mahdiul-alam', 'Md.Mahdiul Alam', 'COO', 'team', '/img/team/md-mahdiul-alam.jpg', 'Chief Operating Officer directing 4K multi-stream arena broadcasting, stage visual engineering, and Commonwealth Esports Championships team operations.', 3),
('gazi-rahman', 'GAZI RAHMAN', 'COO', 'team', '/img/team/gazi-rahman.jpg', 'Chief Operating Officer overseeing tournament rulesets, live refereeing panels, anti-cheat validation, and national competitive integrity.', 4),
-- ESBD TEAM AMBASSADORS
('md-shoikot-islam', 'MD. SHOIKOT ISLAM', 'ESBD Ambassador', 'ambassador', '/img/team/md-shoikot-islam.jpg', 'Official ESBD Team Ambassador (ITZ KABBO) & premier Free Fire creator uniting millions across Bangladesh gaming communities.', 5),
('noyon-hossain', 'NOYON HOSSAIN', 'ESBD Ambassador', 'ambassador', '/img/team/noyon-hossain.jpg', 'Official ESBD Team Ambassador (APOLLO GAMING) representing grassroots community tournaments and youth gamer development.', 6),
('md-rayhan', 'MD. RAYHAN', 'ESBD Ambassador', 'ambassador', '/img/team/md-rayhan.jpg', 'Official ESBD Team Ambassador (HEADSHOT KING) celebrated for competitive sharpshooting and championship broadcast analysis.', 7),
('md-tanvir-ahmed', 'MD. TANVIR AHMED', 'ESBD Ambassador', 'ambassador', '/img/team/md-tanvir-ahmed.jpg', 'Official ESBD Team Ambassador (TIMEBURNERGG), mentoring emerging competitive rosters and collegiate champions.', 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, kind = EXCLUDED.kind, avatar_url = EXCLUDED.avatar_url, bio = EXCLUDED.bio, order_index = EXCLUDED.order_index;

-- SERVICES
INSERT INTO public.services (id, number, title, description, features, order_index) VALUES
('ops', '01', 'Tournament Operations & League Execution', 'Turnkey tournament hosting for brands, publishers, and collegiate leagues with refereeing, server automation, and rule enforcement.', '["Automated Brackets & Anti-Cheat", "LAN & Online Hybrid Tournaments", "Real-Time Room Management", "Player Check-in & Disputes"]'::jsonb, 1),
('broadcast', '02', 'Broadcast Production & Live Stage Direction', 'Broadcast-grade multi-stream production in 4K with AR graphics, dynamic replay systems, casters, and stadium LED video feeds.', '["Custom 3D Virtual Studios", "Caster & Analyst Desks", "Simulcast to YT, FB & Twitch", "Spectator HUD Customization"]'::jsonb, 2),
('influencer', '03', 'Influencer Marketing & Creator Networks', 'Direct access to 50M+ combined gaming audience across Bangladesh through verified creator collaborations and live appearances.', '["Creator Roster Activation", "Sponsored Showmatches & Streams", "Live Event Meet & Greets", "ROI & Engagement Analytics"]'::jsonb, 3),
('activations', '04', 'Brand Activations & Expo Stadium Booths', 'High-impact experiential marketing booths, experience zones, and campus tours designed to put products directly in gamers hands.', '["Interactive Gaming Pods", "Cosplay Competitions & Swag", "On-Ground Product Launches", "Lead & User Acquisition"]'::jsonb, 4)
ON CONFLICT (id) DO NOTHING;

-- MILESTONES
INSERT INTO public.milestones (id, year, title, description, category, image_url) VALUES
('wcg-2012', '2012', 'World Cyber Games (WCG) Bangladesh Representation', 'Organized and represented Bangladesh at the pinnacle of global competitive gaming.', 'Global Stage', '/img/events/wcg-2012.jpg'),
('esports-masters-2013', '2013', 'National Esports Masters Arena', 'Country-wide multi-title championship uniting top PC gaming clans in Dhaka.', 'National LAN', '/img/events/esports-masters-2013.jpg'),
('iub-intra-2015', '2015', 'IUB Intra University Esports Championship', 'First sanctioned collegiate championship with official hardware sponsors.', 'Collegiate', '/img/events/iub-intra-2015.jpg'),
('nsu-cybernauts-2016', '2016', 'NSU Cybernauts Inter-University LAN', 'Record-breaking campus LAN with 1,200+ competitors and national media coverage.', 'Collegiate', '/img/events/nsu-cybernauts-2016.jpg'),
('afgc-2017', '2017', 'Asian Football Gaming Championship Qualifier', 'Sent the Bangladesh national champion to represent in the AFGC Finals in Bangkok.', 'International', '/img/events/afgc-2017.jpg'),
('commonwealth-2022', '2022', 'Commonwealth Esports Championship Representation', 'Selected and fielded team Bangladesh at the Commonwealth Esports Championships in Birmingham.', 'Global Stage', '/img/events/commonwealth-2022.jpg'),
('bali-2023', '2023', 'IESF World Esports Championship Bali', 'Official Bangladesh delegation in Bali for the global IESF showdown.', 'World Stage', '/img/events/bali-2023.jpg'),
('valorant-cup-2024', '2024', 'Valorant Bangladesh Champions Cup', 'Sold-out LAN stage with 500,000 BDT prize pool, live broadcasted to 250K concurrents.', 'Arena LAN', '/img/events/valorant-cup-2024.jpg')
ON CONFLICT (id) DO NOTHING;

-- GALLERY
INSERT INTO public.gallery (id, title, category, image_url, event_name) VALUES
('gal-1', 'Championship Stage & LED Visuals', 'Stage', '/img/gallery/arena-stage.jpg', 'Valorant Champions Cup'),
('gal-2', 'Live Crowd & Audience Waves', 'Crowd', '/img/gallery/crowd.jpg', 'Esports Masters Finals'),
('gal-3', 'Grand Trophy & Medal Ceremony', 'Awards', '/img/gallery/award.jpg', 'National Championship'),
('gal-4', '50-Seat High-Performance LAN Hall', 'LAN Hall', '/img/gallery/lan-hall.jpg', 'NSU Cybernauts'),
('gal-5', 'Broadcast Booth & Caster Setup', 'Production', '/img/gallery/led-booth.jpg', 'ESBD Live Studio'),
('gal-6', 'Team Bangladesh at World Finals', 'National Team', '/img/gallery/team-bali.jpg', 'IESF World Championship Bali')
ON CONFLICT (id) DO NOTHING;

-- TOURNAMENTS
INSERT INTO public.tournaments (id, slug, title, game_id, format, status, prize_pool_minor, currency, entry_fee_minor, sponsor, start_date, max_slots, registered_count, banner_url) VALUES
('esbd-ff-pro-s4', 'free-fire-pro-league-s4', 'ESBD Free Fire Pro League: Season 4', 'free-fire', 'Battle Royale (Squad)', 'live', 15000000, 'BDT', 0, 'ASUS ROG & UCC', NOW() - INTERVAL '2 days', 48, 48, '/img/games/free-fire.png'),
('esbd-val-inv-2026', 'valorant-champions-invitational', 'Valorant Bangladesh Champions Invitational', 'valorant', 'Single Elimination (BO3)', 'registration_open', 25000000, 'BDT', 0, 'Gigabyte AORUS & MSI', NOW() + INTERVAL '5 days', 32, 28, '/img/games/valorant.png'),
('esbd-pubgm-cup', 'pubg-mobile-national-cup', 'PUBG Mobile National Showdown 2026', 'pubg-mobile', 'Battle Royale (Squad)', 'registration_open', 20000000, 'BDT', 0, 'ViewSonic & ZOTAC', NOW() + INTERVAL '9 days', 64, 52, '/img/games/pubg-mobile.png'),
('esbd-cs2-masters', 'cs2-dhaka-masters-lan', 'CS2 Dhaka Masters LAN Season 2', 'cs2', 'Double Elimination', 'registration_open', 18000000, 'BDT', 0, 'Thermaltake BD', NOW() + INTERVAL '14 days', 16, 12, '/img/games/cs2.png'),
('esbd-efootball-cup', 'efootball-bangladesh-cup', 'eFootball Bangladesh Open Championship', 'efootball', 'Single Elimination', 'completed', 8000000, 'BDT', 0, 'ESBD Official', NOW() - INTERVAL '10 days', 64, 64, '/img/games/efootball.png')
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    registered_count = EXCLUDED.registered_count;

-- MATCHES (For Live & Open Tournaments)
INSERT INTO public.matches (id, tournament_id, round_name, round_index, match_index, participant_a_name, participant_b_name, score_a, score_b, status, room_code, room_password, scheduled_at, verified) VALUES
('m-ff-01', 'esbd-ff-pro-s4', 'Semifinals - Match 1', 1, 1, 'RedX Esports', 'Team Legion BD', 1, 0, 'live', 'ESBD-FF-492', 'esbd2026', NOW(), false),
('m-ff-02', 'esbd-ff-pro-s4', 'Semifinals - Match 2', 1, 2, 'Apex Predators', 'Delta Force BD', 0, 0, 'scheduled', 'ESBD-FF-493', 'esbd2026', NOW() + INTERVAL '1 hour', false),
('m-val-01', 'esbd-val-inv-2026', 'Quarterfinals - Match 1', 1, 1, 'Velocity Gaming BD', 'Fatal Strike', 0, 0, 'scheduled', 'TBD', 'TBD', NOW() + INTERVAL '5 days', false)
ON CONFLICT (id) DO NOTHING;

-- LEADERBOARD
INSERT INTO public.leaderboards (rank, game_id, team_name, player_ign, points, wins, matches_played, earnings_minor, badge) VALUES
(1, 'free-fire', 'RedX Esports', 'RedX_Vampire', 2850, 42, 50, 45000000, 'Champion'),
(2, 'free-fire', 'Team Legion BD', 'Legion_Ghost', 2620, 38, 50, 32000000, 'Elite'),
(3, 'free-fire', 'Apex Predators', 'Apex_Sniper', 2410, 34, 48, 24000000, 'Pro'),
(4, 'valorant', 'Velocity Gaming BD', 'Velocity_Aces', 2350, 29, 35, 30000000, 'Radiant'),
(5, 'valorant', 'Fatal Strike', 'Fatal_Kyro', 2180, 26, 35, 20000000, 'Immortal'),
(6, 'pubg-mobile', 'A1 Esports BD', 'A1_Raider', 2740, 39, 45, 38000000, 'Conqueror'),
(7, 'cs2', 'Dhaka Knights', 'DK_Headshot', 1980, 24, 30, 18000000, 'Global')
ON CONFLICT DO NOTHING;

-- NEWSROOM SEED DATA
INSERT INTO public.news (id, slug, title, game_id, game_name, category, author, read_time, summary, image_url, is_featured, content) VALUES
('news-ffws-2026', 'ffws-2026-bangladesh-qualifiers', 'FFWS 2026 Bangladesh National Qualifiers: 48 Elite Squads Set to Battle for Regional Slot', 'free-fire', 'Free Fire', 'Championship', 'ESBD Editorial Staff', '3 min read', 'The roadmap to the Free Fire World Series kicks off in Dhaka with 48 registered squads competing across online group stages and a sold-out LAN grand final.', '/img/games/free-fire.png', true, 'E-SPORTS BANGLADESH today officially unveiled the operational blueprint for the FFWS 2026 Bangladesh Qualifiers. Over 48 squads, verified through competitive ID checks and automated anti-cheat screenings, will lock horns over four weekends of non-stop Battle Royale action.'),
('news-pmgc-2026', 'pmgc-south-asia-bangladesh-roster', 'PMGC South Asia Prelims: Bangladesh National Contenders Confirm Active Starting Roster', 'pubg-mobile', 'PUBG Mobile', 'Roster News', 'Gazi Rahman', '4 min read', 'Leading PUBG Mobile organizations in Bangladesh finalize their tactical rosters ahead of the high-stakes South Asia Prelims hosted under ESBD officiating.', '/img/games/pubg-mobile.png', true, 'With the international competitive window fast approaching, Bangladesh top 16 PUBG Mobile teams have locked their official starting lineups.'),
('news-valorant-cup', 'valorant-champions-cup-bangladesh-2026', 'Valorant Champions Cup 2026: 500,000 BDT Prize Pool Announced with Vanguard LAN Setup', 'valorant', 'Valorant', 'Tournament Alert', 'Sumit S Ron', '3 min read', 'Registration opens for the 500,000 BDT Valorant Champions Cup, featuring dedicated high-tick tournament servers and official Riot Vanguard hardware validation.', '/img/games/valorant.png', true, 'Tactical FPS enthusiasts have a new benchmark to aim for as ESBD announces the Valorant Champions Cup 2026 with a 500,000 BDT prize pool.'),
('news-hardware-expo', 'hardware-expo-asus-aorus-partnership', 'ASUS ROG & Gigabyte AORUS Partner with ESBD to Equip Pro Tournament LAN Arenas', NULL, 'Hardware & Gear', 'Partnership', 'Taksib Amin Khan', '3 min read', 'Official hardware distributors bring 540Hz displays, RTX 4080 Super rigs, and tournament mechanical keyboards to competitive players in Bangladesh.', '/img/clients/asus.png', true, 'E-SPORTS BANGLADESH has solidified strategic hardware partnerships with ASUS ROG, Gigabyte AORUS, MSI, Thermaltake, ViewSonic, ZOTAC, and UCC Bangladesh.')
ON CONFLICT (id) DO NOTHING;

-- SHOP PRODUCTS SEED DATA
INSERT INTO public.products (id, slug, name, brand, category, price_bdt, in_stock, is_tournament_grade, image_url, description) VALUES
('prod-rog-pg248qp', 'asus-rog-swift-pg248qp', 'ASUS ROG Swift Pro PG248QP 540Hz Gaming Display', 'ASUS ROG', 'Monitors', 115000.00, true, true, '/img/clients/asus.png', 'The official stage display for ESBD CS2 and Valorant National Championships. Engineered for zero motion blur.'),
('prod-rog-azoth', 'asus-rog-azoth-wireless', 'ASUS ROG Azoth Wireless 75% Custom Gaming Keyboard', 'ASUS ROG', 'Keyboards', 29500.00, true, true, '/img/clients/asus.png', 'Tournament-certified mechanical keyboard offering unmatched acoustic feedback and rapid response times.'),
('prod-rog-harpe-ace', 'asus-rog-harpe-ace-mouse', 'ASUS ROG Harpe Ace Aim Lab Edition Ultralight Mouse', 'ASUS ROG', 'Mice', 16500.00, true, true, '/img/clients/asus.png', 'Developed alongside esports professionals to provide pixel-precise tracking for tactical shooters.'),
('prod-aorus-rtx4080s', 'gigabyte-aorus-rtx4080-super', 'Gigabyte AORUS GeForce RTX 4080 SUPER Master 16G', 'Gigabyte AORUS', 'Rigs', 168000.00, true, true, '/img/clients/gigabyte.png', 'Powers the primary broadcast rigs and spectator observation cameras at ESBD LAN arenas.'),
('prod-msi-raider-ge78', 'msi-raider-ge78-laptop', 'MSI Raider GE78 HX 14V Tournament Esports Laptop', 'MSI Gaming', 'Rigs', 345000.00, true, true, '/img/clients/msi.png', 'The mobile powerhouse utilized by ESBD live casters, match observers, and travelling national team players.'),
('prod-viewsonic-xg270', 'viewsonic-elite-xg270', 'ViewSonic ELITE XG270 240Hz 1ms Fast IPS Monitor', 'ViewSonic Gaming', 'Monitors', 48500.00, true, true, '/img/clients/viewsonic.png', 'High-refresh workhorse of Bangladesh collegiate esports tournaments, offering vibrant colors and zero ghosting.')
ON CONFLICT (id) DO NOTHING;

-- DEFAULT ADMIN USER SEED (Profiles)
INSERT INTO public.profiles (id, email, ign, display_name, role, wallet_balance_minor) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@esportsbd.com', 'ESBD_Admin', 'ESBD Platform Administrator', 'admin', 5000000)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures public read for showcase and safe user participation
-- =============================================================================
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Games') THEN
        CREATE POLICY "Public Read Games" ON public.games FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Tournaments') THEN
        CREATE POLICY "Public Read Tournaments" ON public.tournaments FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Stats') THEN
        CREATE POLICY "Public Read Stats" ON public.stats FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Clients') THEN
        CREATE POLICY "Public Read Clients" ON public.clients FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Influencers') THEN
        CREATE POLICY "Public Read Influencers" ON public.influencers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Communities') THEN
        CREATE POLICY "Public Read Communities" ON public.communities FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Milestones') THEN
        CREATE POLICY "Public Read Milestones" ON public.milestones FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Gallery') THEN
        CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Staff') THEN
        CREATE POLICY "Public Read Staff" ON public.staff FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Services') THEN
        CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Leaderboards') THEN
        CREATE POLICY "Public Read Leaderboards" ON public.leaderboards FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Matches') THEN
        CREATE POLICY "Public Read Matches" ON public.matches FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Register Tournaments') THEN
        CREATE POLICY "Public Register Tournaments" ON public.tournament_registrations FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Submit Contact') THEN
        CREATE POLICY "Public Submit Contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read News') THEN
        CREATE POLICY "Public Read News" ON public.news FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Products') THEN
        CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Create Orders') THEN
        CREATE POLICY "Public Create Orders" ON public.product_orders FOR INSERT WITH CHECK (true);
    END IF;
END $$;

