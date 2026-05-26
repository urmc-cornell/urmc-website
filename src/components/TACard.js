import React from 'react';
import emailIcon from '../images/ta-directory/email.svg';
import '../styles/tacard.css';

function TACard({ name, email, courses = [] }) {
  return (
    <div className="ta-card">
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
  );
}

export default TACard;
