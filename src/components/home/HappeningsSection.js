import '../../styles/happenings.css';

// TODO: When Figma rate limit resets, extract event photos (nodes 135:47, 141:142, 135:49, 135:50)
// and replace the .photo-placeholder divs with <img> tags.

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
        <div className="photo-placeholder photo-left" aria-label="Anniversary event photo 1" />
        <div className="photo-placeholder photo-center-top" aria-label="Anniversary event photo 2" />
        <div className="photo-placeholder photo-center-bottom" aria-label="Anniversary event photo 3" />
        <div className="photo-placeholder photo-right" aria-label="Anniversary event photo 4" />
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
        </a>
      </div>
    </section>
  );
}
