import { useState } from 'react';
import viewPointsPhoto from '../../images/points-page/momo-shot.png';
import '../../styles/points.css';

export default function ViewYourPointsSection({ topMembers, onLookup }) {
  const [netid, setNetid] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = netid.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    try {
      setResult(await onLookup(trimmed));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="points-vyp-section">
      <div className="points-vyp-left">
        <div className="points-vyp-form-block">
          <div className="points-vyp-heading-block">
            <h2 className="points-vyp-title">View Your Points</h2>
            <p className="points-vyp-subtitle">
              Enter your Cornell NetID to view your current points
            </p>
          </div>
          <form className="points-vyp-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="points-vyp-input"
              placeholder="abc123"
              value={netid}
              disabled={loading}
              onChange={(e) => setNetid(e.target.value)}
              aria-label="Cornell NetID"
            />
            <button type="submit" className="points-vyp-submit" disabled={loading}>
              {loading ? 'Loading…' : 'Enter'}
            </button>
            {result && <span className="points-vyp-result" role="status">{result}</span>}
          </form>
        </div>

        <div className="points-top-members">
          <h3 className="points-top-title">Top Members</h3>
          {topMembers.length === 0 ? (
            <p className="points-top-empty">No data yet for this semester.</p>
          ) : (
            <ul className="points-top-list">
              {topMembers.map((m, i) => (
                <li key={m.netid} className="points-top-row">
                  <span className="points-top-name">
                    <span className="points-top-rank">#{i + 1}:</span>
                    <span>{m.name}</span>
                  </span>
                  <span className="points-top-pts">{m.totalPoints} pts</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="points-vyp-photo-wrap">
        <img
          src={viewPointsPhoto}
          alt="URMC members at an event"
          className="points-vyp-photo"
        />
      </div>
    </section>
  );
}
