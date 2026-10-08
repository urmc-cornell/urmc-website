import { useState, useEffect } from 'react';
import { LEADERSHIP_CATEGORIES } from '../Supporting/LeadershipCategories.js';
import { supabase } from '../lib/supabaseClient.js';
import WhoWeAreHero from '../components/leadership/WhoWeAreHero.js';
import QuoteSection from '../components/leadership/QuoteSection.js';
import TeamSection from '../components/leadership/TeamSection.js';
import MembersSection from '../components/leadership/MembersSection.js';
import MemberPopup from '../components/leadership/MemberPopup.js';
import groupPhoto from '../images/urmcMembers.jpg';
import '../styles/Leadership.css';

function positionPriority(title) {
  const normalized = title.toLowerCase().replace(/[\s–—-]/g, '');
  if (normalized === 'president') return 1;
  if (normalized.includes('copresident')) return 2;
  if (normalized.includes('vicepresident')) return 3;
  return 4;
}

export default function Leadership() {

  const [members, setMembers] = useState({ advisors: [], eboard: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchLeadershipData();
  }, []);

  async function fetchLeadershipData() {
    try {
      const { data, error } = await supabase
        .from('member_directory')
        .select(`
          id, position, headshot_url, secondary_headshot_url,
          first_name, last_name, major, graduation_year, public_email, netid, instagram_url, linkedin_url,
          ask_about, bio, role
        `)
        .or('role.cs.{eboard},role.cs.{advisor}');

      if (error) throw error;

      const mapped = data.map((m) => ({
        id: m.id,
        lastName: m.last_name || '',
        title: m.position || '',
        image: m.headshot_url,
        secondaryImage: m.secondary_headshot_url || m.headshot_url,
        name: `${m.first_name} ${m.last_name}`,
        majors: [
          m.major,
          m.graduation_year && !/(?:20\d{2}|['’]\d{2})/.test(m.major || '')
            ? `’${String(m.graduation_year).slice(-2)}` : null,
        ].filter(Boolean).join(' '),
        email: m.public_email || '',
        insta: m.instagram_url,
        linkedIn: m.linkedin_url,
        askAbout: m.ask_about || [],
        bio: m.bio,
        role: m.role || '',
      }));

      const isAdvisor = (m) => [].concat(m.role).includes('advisor');

      const advisors = mapped
        .filter(isAdvisor)
        .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.name.localeCompare(b.name));

      const eboard = mapped
        .filter((m) => !isAdvisor(m))
        .sort((a, b) => {
          const pa = positionPriority(a.title);
          const pb = positionPriority(b.title);
          if (pa !== pb) return pa - pb;
          if (a.title !== b.title) return a.title.localeCompare(b.title);
          return a.name.localeCompare(b.name);
        });

      setMembers({ advisors, eboard });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const category = LEADERSHIP_CATEGORIES.find(({ key }) => key === activeCategory);

  const showAdvisors = activeCategory === 'all' || activeCategory === 'advisors';
  const filteredEboard = activeCategory === 'all'
    ? members.eboard
    : members.eboard.filter(member => category.positions?.test(member.title));

  if (loading) return <div className="wwa-status">Loading…</div>;
  if (error)   return <div className="wwa-status">Error: {error}</div>;

  return (
    <div className="who-we-are-page">
      <WhoWeAreHero photo={groupPhoto} />
      <QuoteSection />
      <TeamSection activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <MembersSection
        advisors={showAdvisors ? members.advisors : []}
        members={filteredEboard}
        onCardClick={setSelectedMember}
      />
      {selectedMember && (
        <MemberPopup
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
