import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { currentSemester } from '../lib/semester.js';
import PointsHero from '../components/points/PointsHero.js';
import ViewYourPointsSection from '../components/points/ViewYourPointsSection.js';
import HowToEarnSection from '../components/points/HowToEarnSection.js';
import RewardsSection from '../components/points/RewardsSection.js';
import '../styles/points.css';

export default function Points() {

  const semester = currentSemester();
  const [topMembers, setTopMembers] = useState([]);

  useEffect(() => {
    async function fetchTopThree() {
      try {
        const [totals, leadership] = await Promise.all([
          supabase
            .from('member_leaderboard')
            .select('netid, first_name, last_name, total_points')
            .eq('semester', semester),
          supabase
            .from('member_directory')
            .select('netid')
            .contains('role', ['eboard']),
        ]);
        if (totals.error) throw totals.error;
        if (leadership.error) throw leadership.error;
        const eboardNetids = new Set(leadership.data.map((m) => m.netid));

        const ranked = totals.data
          .filter((m) => !eboardNetids.has(m.netid))
          .map((m) => ({
            netid: m.netid,
            name: `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || m.netid,
            totalPoints: Number(m.total_points),
          }))
          .filter((m) => m.totalPoints > 0)
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, 3);

        setTopMembers(ranked);
      } catch (err) {
        console.error('Error fetching top three:', err);
      }
    }
    fetchTopThree();
  }, [semester]);

  const lookupPoints = async (netidInput) => {
    try {
      const { data, error } = await supabase
        .rpc('get_public_member_points', {
          p_netid: netidInput.trim().toLowerCase(),
          p_semester: semester,
        })
        .maybeSingle();

      if (error) throw error;
      if (!data) return 'NetID not found';
      return `${data.total_points} pts`;
    } catch (err) {
      console.error('Error fetching points:', err);
      return 'Error fetching points';
    }
  };

  return (
    <div className="points-page">
      <PointsHero />
      <ViewYourPointsSection topMembers={topMembers} onLookup={lookupPoints} />
      <HowToEarnSection />
      <RewardsSection />
    </div>
  );
}
