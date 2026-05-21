import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { currentSemester } from '../lib/semester.js';
import { useScale } from '../hooks/useScale.js';
import PointsHero from '../components/points/PointsHero.js';
import ViewYourPointsSection from '../components/points/ViewYourPointsSection.js';
import HowToEarnSection from '../components/points/HowToEarnSection.js';
import RewardsSection from '../components/points/RewardsSection.js';
import '../styles/points.css';

const EXCLUDED_NETIDS = new Set([
  'ryg4', 'zas36', 'bm734', 'saf274', 'ga362', 'jcp349', 'kab472',
  'jwj68', 'bbm56', 'jce79', 'ta375', 'doa8', 'reb368', 'lyb4',
  'ga324', 'nt387', 'jt938', 'asa253', 'ce248', 'as3734', 'fmi4',
  'ya287', 'ele54', 'ym582', 'dfb222',
]);

export default function Points() {
  useScale();
  const semester = currentSemester();
  const [topMembers, setTopMembers] = useState([]);

  useEffect(() => {
    async function fetchTopThree() {
      try {
        const { data, error } = await supabase
          .from('members')
          .select(
            'netid, first_name, last_name, points_tracking!points_tracking_member_id_fkey (points, semester)'
          );
        if (error) throw error;

        const ranked = data
          .map((m) => ({
            netid: m.netid,
            name: `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || m.netid,
            totalPoints: (m.points_tracking ?? [])
              .filter((r) => r.semester === semester)
              .reduce((sum, r) => sum + r.points, 0),
          }))
          .filter((m) => m.totalPoints > 0 && !EXCLUDED_NETIDS.has(m.netid))
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
        .single();

      if (error || !data) return 'NetID not found';

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
