import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useScale } from '../hooks/useScale.js';
import WhoWeAreHero from '../components/leadership/WhoWeAreHero.js';
import QuoteSection from '../components/leadership/QuoteSection.js';
import TeamSection from '../components/leadership/TeamSection.js';
import MembersSection from '../components/leadership/MembersSection.js';
import MemberPopup from '../components/leadership/MemberPopup.js';
import groupPhoto from '../images/urmcMembers.jpg';
import '../styles/Leadership.css';

export default function Leadership() {
  useScale();
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
        .from('members')
        .select(`
          id, position, headshot_url, secondary_headshot_url,
          first_name, last_name, major, instagram_url, linkedin_url,
          ask_about, bio, role
        `)
        .or('role.cs.{eboard},role.cs.{advisor}');

      if (error) throw error;

      const getPositionPriority = (title) => {
        const normalized = title.toLowerCase().replace(/\s+/g, '');
        if (normalized === 'president') return 1;
        if (normalized.includes('co-president') || normalized.includes('co–president')) return 2;
        if (normalized.includes('vicepresident') || normalized.includes('vice-president')) return 3;
        return 4;
      };

      const mapped = data.map((m) => ({
        id: m.id,
        title: m.position || '',
        image: m.headshot_url,
        secondaryImage: m.secondary_headshot_url || m.headshot_url,
        name: `${m.first_name} ${m.last_name}`,
        majors: m.major,
        insta: m.instagram_url,
        linkedIn: m.linkedin_url,
        askAbout: m.ask_about || [],
        bio: m.bio,
        role: m.role || '',
      }));

      const ADVISOR_ORDER = ['roberts', 'tardos', 'weatherspoon'];
      const advisorRank = (name) => {
        const lower = name.toLowerCase();
        const idx = ADVISOR_ORDER.findIndex((key) => lower.includes(key));
        return idx === -1 ? 99 : idx;
      };

      const isAdvisor = (m) => [].concat(m.role).includes('advisor');

      const advisors = mapped
        .filter(isAdvisor)
        .sort((a, b) => advisorRank(a.name) - advisorRank(b.name));

      const eboard = mapped
        .filter((m) => !isAdvisor(m))
        .sort((a, b) => {
          const pa = getPositionPriority(a.title);
          const pb = getPositionPriority(b.title);
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

  const EBOARD_FILTER = {
    'all':               () => true,
    'presidents':        (m) => /president/i.test(m.title),
    'events':            (m) => /academic|corporate|event|professional development/i.test(m.title),
    'community-building':(m) => /community|mentorship|social/i.test(m.title),
    'external':          (m) => /external|design|outreach|public relations/i.test(m.title),
    'internal':          (m) => /internal|secretary|treasurer|web development/i.test(m.title),
    'advisors':          () => false,
  };

  const showAdvisors = activeCategory === 'all' || activeCategory === 'advisors';
  const filteredEboard = activeCategory === 'advisors'
    ? []
    : members.eboard.filter(EBOARD_FILTER[activeCategory] ?? (() => true));

  if (loading) return <div className="wwa-status">Loading…</div>;
  if (error)   return <div className="wwa-status">Error: {error}</div>;

  return (
    <div className="who-we-are-page">
      <WhoWeAreHero photo={groupPhoto} />
      <QuoteSection />
      <TeamSection onCategoryChange={setActiveCategory} />
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
