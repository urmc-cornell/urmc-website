import '../../styles/happenings.css';
import eventLeft from '../../images/homes/event-left.jpg';
import eventCenterTop from '../../images/homes/event-center-top.jpg';
import eventCenterBottom from '../../images/homes/event-center-bottom.jpg';
import eventRight from '../../images/homes/event-right.jpg';

const INSTAGRAM_RECAP = 'https://www.instagram.com/p/DW9YIMwkQWi/?img_index=2&igsh=MWkya2Z2c2l1ZWtuMw==';

export default function HappeningsSection() {
  return (
    <section className="happenings">
      <div className="happenings-header">
        <h2 className="happenings-heading">URMC Happenings</h2>
        <a href="/events" className="happenings-view-all">View all events</a>
      </div>

      <h3 className="happenings-event-title">10-Year Anniversary Celebration</h3>

      <div className="happenings-photo-grid">
        <img src={eventLeft} alt="Anniversary event: students holding 10 balloons" className="photo-left" />
        <img src={eventCenterTop} alt="Anniversary event: audience celebrating" className="photo-center-top" />
        <img src={eventCenterBottom} alt="Anniversary event: attendees at table" className="photo-center-bottom" />
        <img src={eventRight} alt="Anniversary event: alumni reconnecting" className="photo-right" />
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
          See the Recap ↗
        </a>
      </div>
    </section>
  );
}
