import { useEffect } from 'react';
import '../../styles/Leadership.css';
import mailGold from '../../images/assets/mailGold.png';
import instaGold from '../../images/assets/instagramGold.png';
import linkedGold from '../../images/assets/linkedinGold.png';
import xIcon from '../../images/assets/x.png';

export default function MemberPopup({ member, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="wwa-popup-backdrop" onClick={handleBackdropClick}>
      <div className="wwa-popup-inner" role="dialog" aria-modal="true" aria-label={`${member.name} profile`}>
        <button className="wwa-popup-close" onClick={onClose} aria-label="Close">
          <img src={xIcon} alt="Close" />
        </button>

        <div className="wwa-popup-top">
          <img
            src={member.secondaryImage || member.image}
            alt={member.name}
            className="wwa-popup-photo"
          />
          <div className="wwa-popup-details">
            <p className="wwa-popup-role">{member.title}</p>
            <h2 className="wwa-popup-name">{member.name}</h2>
            <p className="wwa-popup-major">{member.majors}</p>

            {member.askAbout && member.askAbout.length > 0 && (
              <>
                <p className="wwa-popup-section-label">Ask Me About</p>
                <div className="wwa-popup-pills">
                  {member.askAbout.map((item, i) => (
                    <span key={i} className="wwa-popup-pill">{item}</span>
                  ))}
                </div>
              </>
            )}

            <p className="wwa-popup-section-label">Contact</p>
            <div className="wwa-popup-contacts">
              {/* Links to URMC's main Instagram — member emails are not stored in the DB */}
              <a href="https://www.instagram.com/urmc_cornell/" target="_blank" rel="noreferrer">
                <img src={mailGold} alt="Contact URMC" className="wwa-popup-social-icon" />
              </a>
              {member.insta && (
                <a href={member.insta} target="_blank" rel="noreferrer">
                  <img src={instaGold} alt="Instagram" className="wwa-popup-social-icon" />
                </a>
              )}
              {member.linkedIn && (
                <a href={member.linkedIn} target="_blank" rel="noreferrer">
                  <img src={linkedGold} alt="LinkedIn" className="wwa-popup-social-icon" />
                </a>
              )}
            </div>
          </div>
        </div>

        {member.bio && (
          <p className="wwa-popup-bio">{member.bio}</p>
        )}
      </div>
    </div>
  );
}
