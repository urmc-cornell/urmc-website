import MemberCard from './MemberCard.js';
import '../../styles/Leadership.css';

export default function MembersSection({ advisors = [], members, onCardClick }) {
  return (
    <section className="wwa-members-section">
      {advisors.length > 0 && (
        <div className="wwa-advisors-grid">
          {advisors.map((m) => (
            <div key={m.id}>
              <MemberCard member={m} onClick={onCardClick} />
            </div>
          ))}
        </div>
      )}
      {members.length > 0 && (
        <div className={`wwa-grid${advisors.length > 0 ? ' wwa-grid--below-advisors' : ''}`}>
          {members.map((m) => (
            <div key={m.id}>
              <MemberCard member={m} onClick={onCardClick} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
