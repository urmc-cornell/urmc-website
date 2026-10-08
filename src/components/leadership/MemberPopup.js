import Dialog from '../Dialog.js';
import '../../styles/Leadership.css';
import MemberPhoto from './MemberPhoto.js';
import popoutX from '../../images/assets/popoutX.svg';
import mailGold from '../../images/assets/mailGold.png';
import instaGold from '../../images/assets/instagramGold.png';
import linkedGold from '../../images/assets/linkedinGold.png';

export default function MemberPopup({ member, onClose }) {
  const roleAndMajor = [member.title, member.majors].filter(Boolean).join(' | ');

  return (
    <Dialog className="wwa-popup-backdrop" onClose={onClose} aria-label={`${member.name} profile`}>
      <div className="wwa-popup-inner">

        {/* Square photo — fills full modal height */}
        <div className="wwa-popup-photo-wrap">
          <MemberPhoto
            src={member.secondaryImage}
            fallbackSrc={member.image}
            alt={member.name}
            className="wwa-popup-photo"
          />
        </div>

        {/* Right content column */}
        <div className="wwa-popup-content">
          <div className="wwa-popup-info">
            <div className="wwa-popup-header">
              <h2 className="wwa-popup-name">{member.name}</h2>
              {roleAndMajor && <p className="wwa-popup-role">{roleAndMajor}</p>}
            </div>

            {member.askAbout?.length > 0 && (
              <div className="wwa-popup-ask">
                <p className="wwa-popup-ask-label">Ask me about:</p>
                <div className="wwa-popup-pills">
                  {member.askAbout.map((topic, i) => (
                    <span key={i} className="wwa-popup-pill">{topic}</span>
                  ))}
                </div>
              </div>
            )}

            {member.bio && (
              <p className="wwa-popup-bio">{member.bio}</p>
            )}
          </div>

          {/* Social icons — bottom right */}
          <div className="wwa-popup-socials">
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                <img src={mailGold} alt="" className="wwa-popup-social-icon" />
              </a>
            )}
            {member.insta && (
              <a href={member.insta} target="_blank" rel="noreferrer" aria-label="Instagram">
                <img src={instaGold} alt="Instagram" className="wwa-popup-social-icon" />
              </a>
            )}
            {member.linkedIn && (
              <a href={member.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <img src={linkedGold} alt="LinkedIn" className="wwa-popup-social-icon" />
              </a>
            )}
          </div>
        </div>

        {/* Close button */}
        <button data-dialog-close="" type="button" className="wwa-popup-close" onClick={onClose} aria-label="Close">
          <img src={popoutX} alt="" />
        </button>
      </div>
    </Dialog>
  );
}
