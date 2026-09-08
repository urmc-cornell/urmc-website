import React, { useState } from 'react';
import emailIcon from '../images/ta-directory/email.svg';
import '../styles/tacard.css';

function TACard({ name, email, courses = [], photoUrl }) {
  const [failedPhoto, setFailedPhoto] = useState(null);

  return (
    <div className="ta-card">
      <div className="ta-card__photo-frame">
        {photoUrl && photoUrl !== failedPhoto && (
          <img
            className="ta-card__photo"
            src={photoUrl}
            alt=""
            loading="lazy"
            onError={() => setFailedPhoto(photoUrl)}
          />
        )}
      </div>
      <div className="ta-card__details">
      <p className="ta-card__name">{name}</p>
      <div className="ta-card__tags">
        {courses.map((course) => (
          <span key={course} className="ta-card__tag">
            {course}
          </span>
        ))}
      </div>
      <a className="ta-card__email" href={`mailto:${email}`}>
        <img src={emailIcon} alt="" className="ta-card__email-icon" />
        <span className="ta-card__email-text">{email}</span>
      </a>
      </div>
    </div>
  );
}

export default TACard;
