import { useRef } from 'react';
import MemberCard from './MemberCard';
import '../../styles/Leadership.css';

export default function MembersSection({ members, onCardClick }) {
  const cardRefs = useRef({});

  const scrollToCard = (id) => {
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="wwa-members-section">
      {/* Sidebar — desktop only, hidden on mobile via CSS */}
      <aside className="wwa-sidebar">
        <p className="wwa-sidebar-heading">Members</p>
        <ul className="wwa-sidebar-list">
          {members.map((m) => (
            <li key={m.id} className="wwa-sidebar-item">
              <button
                className="wwa-sidebar-btn"
                onClick={() => scrollToCard(m.id)}
              >
                <span className="wwa-sidebar-name">{m.name}</span>
                <span className="wwa-sidebar-role">{m.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Card grid */}
      <div className="wwa-grid">
        {members.map((m) => (
          <div
            key={m.id}
            ref={(el) => { cardRefs.current[m.id] = el; }}
          >
            <MemberCard member={m} onClick={onCardClick} />
          </div>
        ))}
      </div>
    </section>
  );
}
