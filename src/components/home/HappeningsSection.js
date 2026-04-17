import '../../styles/happenings.css';
import eventLeft from '../../images/home/event-left.jpg';
import eventCenterTop from '../../images/home/event-center-top.jpg';
import eventCenterBottom from '../../images/home/event-center-bottom.jpg';
import eventRight from '../../images/home/event-right.jpg';

const INSTAGRAM_RECAP = 'https://www.instagram.com/p/DW9YIMwkQWi/?img_index=2&igsh=MWkya2Z2c2l1ZWtuMw==';

export default function HappeningsSection() {
  return (
    <section className="happenings">
      {/* Header */}
      <div className="happenings-header">
        <h2 className="happenings-heading">URMC Happenings</h2>
        <a href="/events" className="happenings-view-all">View all events</a>
      </div>

      {/* Event block */}
      <div className="happenings-event">
        <h3 className="happenings-event-title">10-Year Anniversary Celebration</h3>

        <div className="happenings-photo-grid">
          <img src={eventLeft}         alt="Anniversary event"            className="photo-left" />
          <img src={eventCenterTop}    alt="Anniversary event: audience"  className="photo-center-top" />
          <img src={eventCenterBottom} alt="Anniversary event: attendees" className="photo-center-bottom" />
          <div className="photo-right">
            <img src={eventRight} alt="Anniversary event: alumni" className="photo-right-img" />
          </div>
        </div>

        <div className="happenings-footer">
          <p className="happenings-description">
            Our 10-Year Anniversary in March 2026 brought together students, alumni, and faculty to
            celebrate a decade of impact in computing. From alumni panels to performances and
            reconnecting, it was a day to remember.
          </p>
          <a
            href={INSTAGRAM_RECAP}
            className="happenings-recap-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            See the Recap
            <svg className="happenings-recap-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 21L21 5M21 5H9M21 5V17" stroke="#1f1f1f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
