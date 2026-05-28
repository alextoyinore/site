-- ==========================================
-- Supabase Schema for AADI Website
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. BLOGS TABLE
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    image TEXT,
    excerpt TEXT,
    featured BOOLEAN DEFAULT FALSE,
    content JSONB DEFAULT '{"blocks": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    description JSONB DEFAULT '{"blocks": []}'::jsonb,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GALLERY ALBUMS TABLE
CREATE TABLE IF NOT EXISTS gallery_albums (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    cover TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. GALLERY PHOTOS TABLE
CREATE TABLE IF NOT EXISTS gallery_photos (
    id SERIAL PRIMARY KEY,
    album_id TEXT REFERENCES gallery_albums(id) ON DELETE CASCADE,
    src TEXT NOT NULL,
    alt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TEAM TABLE
CREATE TABLE IF NOT EXISTS team (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    category TEXT DEFAULT 'board',
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SPONSORS TABLE
CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    level TEXT NOT NULL DEFAULT 'Bronze Sponsor',
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PARTNERS TABLE
CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. VOLUNTEERS & MEMBERS TABLE
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Volunteer',
    status TEXT NOT NULL DEFAULT 'Pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    attendees INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor TEXT NOT NULL DEFAULT 'Anonymous',
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. REPORTS TABLE (Event Post-Activity Reports)
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    content JSONB DEFAULT '{"blocks": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content JSONB DEFAULT '{"blocks": []}'::jsonb,
    image TEXT,
    color TEXT DEFAULT 'var(--primary)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Enable read access for public and CRUD for all tables.
-- For a standard simple backend, we'll allow public reads and writes
-- or you can lock down write operations to authenticated admins as needed.

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Public Read access policies
DROP POLICY IF EXISTS "Allow public read blogs" ON blogs;
CREATE POLICY "Allow public read blogs" ON blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read events" ON events;
CREATE POLICY "Allow public read events" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read gallery_albums" ON gallery_albums;
CREATE POLICY "Allow public read gallery_albums" ON gallery_albums FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read gallery_photos" ON gallery_photos;
CREATE POLICY "Allow public read gallery_photos" ON gallery_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read team" ON team;
CREATE POLICY "Allow public read team" ON team FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read sponsors" ON sponsors;
CREATE POLICY "Allow public read sponsors" ON sponsors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read partners" ON partners;
CREATE POLICY "Allow public read partners" ON partners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read volunteers" ON volunteers;
CREATE POLICY "Allow public read volunteers" ON volunteers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read contacts" ON contacts;
CREATE POLICY "Allow public read contacts" ON contacts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read event_registrations" ON event_registrations;
CREATE POLICY "Allow public read event_registrations" ON event_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read donations" ON donations;
CREATE POLICY "Allow public read donations" ON donations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read reports" ON reports;
CREATE POLICY "Allow public read reports" ON reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read programs" ON programs;
CREATE POLICY "Allow public read programs" ON programs FOR SELECT USING (true);

-- Public Write access policies (for forms)
DROP POLICY IF EXISTS "Allow public insert volunteers" ON volunteers;
CREATE POLICY "Allow public insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert contacts" ON contacts;
CREATE POLICY "Allow public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert event_registrations" ON event_registrations;
CREATE POLICY "Allow public insert event_registrations" ON event_registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert donations" ON donations;
CREATE POLICY "Allow public insert donations" ON donations FOR INSERT WITH CHECK (true);

-- Admin CRUD access policies
DROP POLICY IF EXISTS "Allow full access for all operations blogs" ON blogs;
CREATE POLICY "Allow full access for all operations blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations events" ON events;
CREATE POLICY "Allow full access for all operations events" ON events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations gallery_albums" ON gallery_albums;
CREATE POLICY "Allow full access for all operations gallery_albums" ON gallery_albums FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations gallery_photos" ON gallery_photos;
CREATE POLICY "Allow full access for all operations gallery_photos" ON gallery_photos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations team" ON team;
CREATE POLICY "Allow full access for all operations team" ON team FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations sponsors" ON sponsors;
CREATE POLICY "Allow full access for all operations sponsors" ON sponsors FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations partners" ON partners;
CREATE POLICY "Allow full access for all operations partners" ON partners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations volunteers" ON volunteers;
CREATE POLICY "Allow full access for all operations volunteers" ON volunteers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations contacts" ON contacts;
CREATE POLICY "Allow full access for all operations contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations event_registrations" ON event_registrations;
CREATE POLICY "Allow full access for all operations event_registrations" ON event_registrations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations donations" ON donations;
CREATE POLICY "Allow full access for all operations donations" ON donations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations reports" ON reports;
CREATE POLICY "Allow full access for all operations reports" ON reports FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for all operations programs" ON programs;
CREATE POLICY "Allow full access for all operations programs" ON programs FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed Blogs
INSERT INTO blogs (id, title, author, date, image, excerpt, featured, content) VALUES
(1, 'Empowering Women through Economic Interventions', 'AADI Editorial Team', '2024-05-10', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000', 'Discover how our recent economic empowerment programs are transforming the lives of vulnerable women in Nigeria...', TRUE, '{
    "time": 1715340000000,
    "blocks": [
        {"type": "header", "data": {"text": "Economic Empowerment: A Path to Dignity", "level": 2}},
        {"type": "paragraph", "data": {"text": "At Abigail Aina Development Initiative (AADI), we believe that empowering a woman is empowering a community. Our latest program focused on providing seed capital and vocational training to 50 indigent women in the Akure South local government area."}},
        {"type": "paragraph", "data": {"text": "Economic vulnerability is often at the root of many social injustices faced by women. By providing them with the tools and resources to start their own small-scale businesses, we are not just giving them money; we are giving them a future of independence and self-reliance."}},
        {"type": "header", "data": {"text": "Key Highlights of the Program", "level": 3}},
        {"type": "list", "data": {"style": "unordered", "items": [
            "Vocational training in tailoring, soap making, and food processing.",
            "Provision of seed capital to start individual micro-enterprises.",
            "Mentorship from established female entrepreneurs in the state.",
            "Access to basic financial literacy and bookkeeping training."
        ]}},
        {"type": "quote", "data": {"text": "The joy on the faces of these women as they received their startup kits was a testament to the fact that hope can indeed be restored.", "caption": "Mrs. Comfort Joke Abimbola, Trustee", "alignment": "left"}},
        {"type": "paragraph", "data": {"text": "The results have been overwhelming. Within just three months, 80% of the participants have successfully launched their businesses and are already contributing to their household income, bringing lasting succor to their homes."}}
    ]
}'::jsonb),
(2, 'Education Support: The Foundation for a Brighter Future', 'Dr. Funmi Edwin', '2024-04-22', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000', 'AADI''s commitment to education continues with the scholarship awards for children of indigent parents in Akure...', TRUE, '{
    "time": 1713780000000,
    "blocks": [
        {"type": "header", "data": {"text": "Investing in the Next Generation", "level": 2}},
        {"type": "paragraph", "data": {"text": "Education is the bedrock of development and the most powerful tool for breaking the cycle of poverty. Unfortunately, for many families in our community, the cost of quality education is a luxury they cannot afford."}},
        {"type": "paragraph", "data": {"text": "Through our Education Support Program, AADI has stepped in to bridge this gap. We believe that every child, regardless of their background, deserves the opportunity to learn, grow, and reach their full potential."}},
        {"type": "header", "data": {"text": "Our Impact in Numbers", "level": 3}},
        {"type": "list", "data": {"style": "ordered", "items": [
            "120 full scholarships awarded for the current academic session.",
            "Over 500 school bags and stationery kits distributed.",
            "Rehabilitation of two community primary school libraries.",
            "Provision of school uniforms to children in remote villages."
        ]}},
        {"type": "paragraph", "data": {"text": "Our focus is not just on enrollment, but on retention. We work closely with parents and teachers to ensure that our beneficiaries stay in school and excel in their studies. The future of Nigeria depends on the quality of education we provide for our children today."}},
        {"type": "quote", "data": {"text": "When we educate a child, we are not just teaching them to read and write; we are building a leader, a scientist, and a change-maker.", "caption": "Dr. Funmi Edwin, Trustee", "alignment": "left"}}
    ]
}'::jsonb),
(3, 'Campaign Against Gender Inequality: A Voice for the Vulnerable', 'Comfort Joke Abimbola', '2024-03-08', 'https://images.unsplash.com/photo-1542833180-290883bbaa95?auto=format&fit=crop&q=80&w=1000', 'On International Women''s Day, AADI launched a major advocacy campaign to address gender-based violence and social injustice...', FALSE, '{
    "time": 1709890000000,
    "blocks": [
        {"type": "header", "data": {"text": "Breaking the Silence on Social Injustice", "level": 2}},
        {"type": "paragraph", "data": {"text": "Standing up against inequality is at the heart of AADI''s mission. For too long, the voices of the vulnerable have been silenced by systemic barriers and social prejudices. On this year''s International Women''s Day, we said ''no more''."}},
        {"type": "paragraph", "data": {"text": "AADI launched a statewide advocacy campaign centered on three core pillars: Protection of the Child Right, prevention of gender-based violence, and promoting equal access to justice for the poor."}},
        {"type": "header", "data": {"text": "Campaign Activities", "level": 3}},
        {"type": "list", "data": {"style": "unordered", "items": [
            "Stakeholder forum with legal practitioners and law enforcement agencies.",
            "Community awareness walks across major markets in Akure.",
            "Radio and television talk shows on the rights of the girl-child.",
            "Establishment of a legal aid help desk for indigent women."
        ]}},
        {"type": "paragraph", "data": {"text": "The campaign is not a one-day event; it is a sustained movement. We are working with policy makers to strengthen existing laws and ensure that the voices of the underprivileged are heard in the corridors of power."}},
        {"type": "quote", "data": {"text": "Justice is not a privilege; it is a right. AADI will continue to be the voice for those who have been marginalized.", "caption": "AADI Legal Advocacy Team", "alignment": "left"}}
    ]
}'::jsonb),
(4, 'Environmental Intervention: Preserving Our Community', 'AADI Outreach Coordinator', '2024-02-15', 'https://images.unsplash.com/photo-1532996130211-0ea4fb03604f?auto=format&fit=crop&q=80&w=1000', 'AADI led a massive tree-planting and waste management awareness drive in local communities to promote sustainable living...', FALSE, '{
    "time": 1707990000000,
    "blocks": [
        {"type": "header", "data": {"text": "Nurturing the Earth for Future Generations", "level": 2}},
        {"type": "paragraph", "data": {"text": "A healthy environment is the foundation of a healthy community. At AADI, we recognize that climate change and environmental degradation pose significant threats to the well-being of the vulnerable populations we serve."}},
        {"type": "paragraph", "data": {"text": "Our recent environmental intervention program focused on two critical areas: sustainable waste management and reforestation. We believe that local actions can have a global impact."}},
        {"type": "header", "data": {"text": "Our Achievements", "level": 3}},
        {"type": "list", "data": {"style": "unordered", "items": [
            "Over 300 indigenous trees planted across three local schools.",
            "Community cleanup drive removing 5 tons of non-biodegradable waste.",
            "Distribution of eco-friendly waste bins to 100 households.",
            "Training sessions on plastic recycling and upcycling for local youth."
        ]}},
        {"type": "paragraph", "data": {"text": "By involving the youth in these activities, we are raising a generation of environmental stewards. Sustainability is not just a buzzword for us; it is a way of life that ensures our children inherit a world that is still habitable and beautiful."}},
        {"type": "quote", "data": {"text": "The earth does not belong to us; we belong to the earth. Preserving it is our collective responsibility.", "caption": "AADI Environmental Outreach", "alignment": "left"}}
    ]
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Events
INSERT INTO events (id, title, date, location, description, image) VALUES
(1, 'Women Empowerment Workshop', '2026-07-15', 'Akure Civic Center, Ondo State', '{"blocks": [{"type": "paragraph", "data": {"text": "A hands-on workshop focused on vocational skills and financial literacy for vulnerable women."}}]}'::jsonb, 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000'),
(2, 'Educational Scholarship Award Ceremony', '2026-08-20', 'AADI Head Office, Akure', '{"blocks": [{"type": "paragraph", "data": {"text": "Celebrating the academic achievements of our scholarship beneficiaries and handing out school supplies."}}]}'::jsonb, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000'),
(3, 'Community Health and Welfare Check', '2026-09-10', 'Oda Road Community Hall, Akure', '{"blocks": [{"type": "paragraph", "data": {"text": "Free medical screening and distribution of essential living supplies to the elderly and indigent."}}]}'::jsonb, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000'),
(4, 'Gender Equality Advocacy Walk', '2026-10-05', 'Central Market to State Secretariat, Akure', '{"blocks": [{"type": "paragraph", "data": {"text": "Raising awareness and calling for social justice for the vulnerable members of our society."}}]}'::jsonb, 'https://images.unsplash.com/photo-1573164713988-cb9a1c6a6676?auto=format&fit=crop&q=80&w=1000')
ON CONFLICT (id) DO NOTHING;

-- Seed Gallery Albums
INSERT INTO gallery_albums (id, title, date, cover) VALUES
('outreach-2024', 'Community Outreach 2024', '2024-11-20', 'https://picsum.photos/seed/outreach/800/600'),
('fundraising-gala', 'Annual Fundraising Gala', '2024-12-15', 'https://picsum.photos/seed/gala/800/600'),
('school-visit', 'School Visitation Project', '2024-10-05', 'https://picsum.photos/seed/school/800/600')
ON CONFLICT (id) DO NOTHING;

-- Seed Gallery Photos
INSERT INTO gallery_photos (album_id, src, alt) VALUES
('outreach-2024', 'https://picsum.photos/seed/outreach1/800/600', 'Distribution of supplies'),
('outreach-2024', 'https://picsum.photos/seed/outreach2/800/600', 'Medical checkups'),
('outreach-2024', 'https://picsum.photos/seed/outreach3/800/600', 'Community gathering'),
('outreach-2024', 'https://picsum.photos/seed/outreach4/800/600', 'Volunteers at work'),
('fundraising-gala', 'https://picsum.photos/seed/gala1/800/600', 'Opening speech'),
('fundraising-gala', 'https://picsum.photos/seed/gala2/800/600', 'Awards presentation'),
('fundraising-gala', 'https://picsum.photos/seed/gala3/800/600', 'Guests mingling'),
('school-visit', 'https://picsum.photos/seed/school1/800/600', 'Classroom session'),
('school-visit', 'https://picsum.photos/seed/school2/800/600', 'Library donation'),
('school-visit', 'https://picsum.photos/seed/school3/800/600', 'Students reading');

-- Seed Team
INSERT INTO team (id, name, role, bio, category) VALUES
(1, 'Mrs. Comfort Joke Abimbola', 'Trustee / Nursing Professional / Entrepreneur', 'Mrs. Comfort Joke Abimbola is a seasoned Nursing professional and an entrepreneur with a strong passion for social welfare and Community Health Care. Her career in Nursing reflects compassion, discipline, and service to humanity, while her entrepreneurial engagement underscores empowerment, self-reliance, and sustainability.', 'board'),
(2, 'Mrs. Margaret Adekemi Falade', 'Trustee / Compliance Manager', 'Mrs. Margaret Adekemi Falade is an experienced Compliance Manager with deep expertise in regulatory frameworks, governance, and risk management. Her professional competence ensures that AADI operates within approved standards, adheres strictly to regulations, and maintains transparency and accountability.', 'board'),
(3, 'Miss Abigail Olubukola Abimbola', 'Trustee / Business Continuity Manager', 'Miss Abigail Olubukola Abimbola is a Business Continuity Manager with specialized skills in strategic planning, organizational resilience, and risk mitigation. Her expertise supports the sustainability and long-term viability of AADI’s programs.', 'board'),
(4, 'Chief Magistrate ‘Funmi Edwin', 'Trustee / Barrister and Solicitor @ Law', 'Mrs. ‘Funmi Edwin is a legal practitioner with vast experience in law, justice administration, adjudication, protocol, youth focused ministry and advocacy, social welfare project planning, and governance. She is a staunch advocate for Child Rights protection.', 'board')
ON CONFLICT (id) DO NOTHING;

-- Seed Sponsors
INSERT INTO sponsors (id, name, logo, level) VALUES
(1, 'Acme Corp', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200', 'Gold Sponsor'),
(2, 'Beta Industries', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200', 'Silver Sponsor'),
(3, 'Gamma Solutions', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200', 'Bronze Sponsor')
ON CONFLICT (id) DO NOTHING;

-- Seed Partners
INSERT INTO partners (id, name, logo, website) VALUES
(1, 'Global Relief Fund', 'https://images.unsplash.com/photo-1554200876-56c2f25224fa?auto=format&fit=crop&q=80&w=200', 'https://example.com'),
(2, 'Tech for Good', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200', 'https://example.com'),
(3, 'Education First', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200', 'https://example.com'),
(4, 'Health Alliance', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200', 'https://example.com'),
(5, 'Sustainable Future', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200', 'https://example.com')
ON CONFLICT (id) DO NOTHING;

-- Seed Volunteers
INSERT INTO volunteers (id, name, email, phone, role, status) VALUES
(1, 'Alice Walker', 'alice@example.com', '555-0101', 'Volunteer', 'Active'),
(2, 'Bob Harris', 'bob@example.com', '555-0102', 'Member', 'Pending'),
(3, 'Charlie Kim', 'charlie@example.com', '555-0103', 'Volunteer', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Seed Donations
INSERT INTO donations (id, donor, amount, date, status) VALUES
(1234, 'Anonymous', 50.00, '2023-10-25', 'Completed'),
(1235, 'Sarah Smith', 120.00, '2023-10-24', 'Completed'),
(1236, 'John Doe', 25.00, '2023-10-23', 'Completed')
ON CONFLICT (id) DO NOTHING;

-- Seed Programs
INSERT INTO programs (id, title, description, color, image, content) VALUES
(1, 'Girl Child Education', 'Scholarships and supplies for girls in rural areas to ensure they complete secondary education.', 'var(--primary)', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000', '{"blocks": [{"type": "header", "data": {"text": "Empowering Girls Through Quality Education", "level": 2}}, {"type": "paragraph", "data": {"text": "In many rural communities, girl-child education is often cut short due to economic challenges, cultural biases, and lack of school supplies. AADI''s Girl Child Education initiative aims to eliminate these obstacles by providing full scholarships, academic materials, and hygiene resources."}}, {"type": "header", "data": {"text": "Core Program Pillars", "level": 3}}, {"type": "list", "data": {"style": "unordered", "items": ["Full tuition scholarships for secondary school girls in vulnerable positions.", "Distribution of reusable sanitary pads and hygiene kits to promote attendance.", "Annual distributions of backpacks, textbooks, and writing materials.", "After-school mentorship programs covering leadership, career planning, and health education."]}}, {"type": "paragraph", "data": {"text": "By ensuring girls complete their secondary education, we empower them to pursue higher career paths and make decisions that uplift their whole communities, breaking historical generational cycles of poverty."}}]}'::jsonb),
(2, 'Women Entrepreneurship', 'Micro-grants and business training for women starting small businesses.', 'var(--accent)', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000', '{"blocks": [{"type": "header", "data": {"text": "Fostering Economic Independence & Self-Reliance", "level": 2}}, {"type": "paragraph", "data": {"text": "Women entrepreneurship is one of the most effective ways to drive local economic growth. This program provides seed grants, financial literacy workshops, and ongoing group-lending access to help women conceptualize and scale sustainable enterprises."}}, {"type": "header", "data": {"text": "Program Components", "level": 3}}, {"type": "list", "data": {"style": "unordered", "items": ["Business development training including bookkeeping and cost modeling.", "Access to interest-free micro-grants for initial equipment and inventory purchase.", "Peer support networks and monthly check-ins with business advisors.", "Market linkage platforms to showcase products to a wider consumer base."]}}, {"type": "paragraph", "data": {"text": "When a woman is financially self-sufficient, her entire family benefits from improved nutrition, healthcare, and educational access. We are proud to support over 150 local female-led start-ups."}}]}'::jsonb),
(3, 'Health Outreach', 'Free medical checkups and malaria prevention supplies for communities.', 'var(--secondary)', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000', '{"blocks": [{"type": "header", "data": {"text": "Providing Healthcare Support to Vulnerable Populations", "level": 2}}, {"type": "paragraph", "data": {"text": "Good health is the foundation of structural prosperity. Our medical outreach caravans bring free screening, primary healthcare diagnostics, and preventative resources directly to underserved rural regions."}}, {"type": "header", "data": {"text": "What We Provide", "level": 3}}, {"type": "list", "data": {"style": "unordered", "items": ["Free hypertension, diabetes, and basic health screenings.", "Distribution of long-lasting insecticide-treated bed nets to combat malaria.", "Maternal wellness kits and expert counseling on pre-natal/post-natal care.", "Free dispensing of doctor-prescribed essential medications."]}}, {"type": "paragraph", "data": {"text": "Our community outreach days occur quarterly, and we partner with voluntary doctors, nurses, and local clinics to ensure proper secondary follow-ups are booked for cases requiring ongoing care."}}]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Fix identity sequences for serial tables
SELECT setval('blogs_id_seq', COALESCE((SELECT MAX(id)+1 FROM blogs), 1), false);
SELECT setval('events_id_seq', COALESCE((SELECT MAX(id)+1 FROM events), 1), false);
SELECT setval('team_id_seq', COALESCE((SELECT MAX(id)+1 FROM team), 1), false);
SELECT setval('sponsors_id_seq', COALESCE((SELECT MAX(id)+1 FROM sponsors), 1), false);
SELECT setval('partners_id_seq', COALESCE((SELECT MAX(id)+1 FROM partners), 1), false);
SELECT setval('volunteers_id_seq', COALESCE((SELECT MAX(id)+1 FROM volunteers), 1), false);
SELECT setval('donations_id_seq', COALESCE((SELECT MAX(id)+1 FROM donations), 1), false);
SELECT setval('reports_id_seq', COALESCE((SELECT MAX(id)+1 FROM reports), 1), false);
SELECT setval('programs_id_seq', COALESCE((SELECT MAX(id)+1 FROM programs), 1), false);
