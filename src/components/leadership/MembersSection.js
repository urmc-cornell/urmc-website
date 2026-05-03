import MemberCard from './MemberCard.js';
import '../../styles/Leadership.css';

export default function MembersSection({ members, onCardClick }) {
  return (
    <section className="wwa-members-section">
      <div className="wwa-grid">
        {members.map((m) => (
          <div key={m.id}>
            <MemberCard member={m} onClick={onCardClick} />
          </div>
        ))}
      </div>
    </section>
  );
}
