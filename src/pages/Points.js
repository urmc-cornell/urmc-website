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
        const { data, error } = await supabase
          .from('members')
          .select(
            'netid, first_name, last_name, role, points_tracking!points_tracking_member_id_fkey (points, semester)'
          );
        if (error) throw error;

        const ranked = data
          .filter((m) => ![].concat(m.role).includes('eboard'))
          .map((m) => ({
            netid: m.netid,
            name: `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || m.netid,
            totalPoints: (m.points_tracking ?? [])
              .filter((r) => r.semester === semester)
              .reduce((sum, r) => sum + r.points, 0),
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
        .from('members')
        .select(
          'netid, points_tracking!points_tracking_member_id_fkey (points, semester)'
        )
        .eq('netid', netidInput.toLowerCase())
        .eq('points_tracking.semester', semester)
        .maybeSingle();

      if (error) throw error;
      if (!data) return 'NetID not found';

      const total = (data.points_tracking ?? []).reduce(
        (sum, r) => sum + r.points,
        0
      );
      return `${total} pts`;
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
