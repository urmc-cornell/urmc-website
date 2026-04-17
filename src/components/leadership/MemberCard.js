import '../../styles/Leadership.css';

export default function MemberCard({ member, onClick }) {
  return (
    <button
      className="wwa-member-card"
      onClick={() => onClick(member)}
      aria-label={`View ${member.name}'s profile`}
    >
      <div className="wwa-member-card-photo-wrap">
        <img
          src={member.image}
          alt={member.name}
          className="wwa-member-card-photo"
        />
      </div>
      <div className="wwa-member-card-info">
        <p className="wwa-member-card-name">{member.name}</p>
        <p className="wwa-member-card-role">{member.title}</p>
      </div>
    </button>
  );
}
