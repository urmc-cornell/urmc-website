import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useScale } from '../hooks/useScale.js';
import WhoWeAreHero from '../components/leadership/WhoWeAreHero.js';
import QuoteSection from '../components/leadership/QuoteSection.js';
import MembersSection from '../components/leadership/MembersSection.js';
import MemberPopup from '../components/leadership/MemberPopup.js';
import groupPhoto from '../images/eboardPhoto.jpg';
import '../styles/Leadership.css';

export default function Leadership() {
  useScale();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

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
        .contains('role', ['eboard']);

      if (error) throw error;

      const getPositionPriority = (title) => {
        const normalized = title.toLowerCase().replace(/\s+/g, '');
        if (normalized === 'president') return 1;
        if (normalized.includes('co-president') || normalized.includes('co–president')) return 2;
        if (normalized.includes('vicepresident') || normalized.includes('vice-president')) return 3;
        return 4;
      };

      const sorted = data
        .map((m) => ({
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
        }))
        .sort((a, b) => {
          const pa = getPositionPriority(a.title);
          const pb = getPositionPriority(b.title);
          if (pa !== pb) return pa - pb;
          if (a.title !== b.title) return a.title.localeCompare(b.title);
          return a.name.localeCompare(b.name);
        });

      setMembers(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="wwa-status">Loading…</div>;
  if (error)   return <div className="wwa-status">Error: {error}</div>;

  return (
    <div className="who-we-are-page">
      <WhoWeAreHero photo={groupPhoto} />
      <QuoteSection />
      <MembersSection
        members={members}
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
