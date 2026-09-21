// Temporarily disabled featured-event dialogs; kept commented out for restoration.

// import { useState } from 'react';
import RedesignHero from '../components/RedesignHero.js';
// import FeaturedEventDialog from '../components/FeaturedEventDialog.js';
import hero from '../images/events/hero.jpg';
import bowling from '../images/events/bowling.jpg';
import sharkTank from '../images/events/shark-tank.jpg';
import marchGbody from '../images/events/march-gbody.jpg';
import trivia from '../images/events/trivia.jpg';
import careerQuest from '../images/events/career-quest.jpg';
import prelimReview from '../images/events/prelim-review.jpg';
import slackIcon from '../images/getting-involved/slack-icon.svg';
import instagramIcon from '../images/events/instagram.svg';
import '../styles/Events.css';

const SLACK_URL = 'https://join.slack.com/t/urmc/shared_invite/zt-2dy8ndtoy-~6zcRR2skt7Z5iT5iAyIBg';
const INSTAGRAM_RECAP_URL = 'https://www.instagram.com/p/DWZkLCKkQhS/';
// const INSTAGRAM_URL = 'https://www.instagram.com/urmc_cornell/';
const CALENDAR_URL = 'https://calendar.google.com/calendar/embed?src=c_c774353cbf4312cb22fc533ead50cc32589840c1ee4a56ec388ad2c4c4d7478a%40group.calendar.google.com&ctz=America%2FNew_York';
const FEATURED_EVENTS = [
  { id: 'bowling', image: bowling, title: 'URMC x Verkada Bowling Social', details: 'April 16, 2026 | 7pm | Helen Newman', tags: ['Social', 'Corporate'], description: 'We partnered with Verkada for a night of bowling, networking, and great conversations with industry professionals! Members had the chance to learn more about the company in a fun and relaxed setting.' },
  { id: 'shark-tank', image: sharkTank, title: 'Shark Tank: Startups 101' },
  { id: 'march-gbody', image: marchGbody, title: 'March G-Body: Imposter Syndrome' },
  { id: 'trivia', image: trivia, title: 'M&M Trivia Night' },
  { id: 'career-quest', image: careerQuest, title: 'Computing Career Quest' },
  { id: 'prelim-review', image: prelimReview, title: 'CS 1110 & 2110 Prelim Reviews' },
];

export default function Events() {

  // const [selectedEvent, setSelectedEvent] = useState(null);
  return (
    <main className="redesign-page events-page">
      <RedesignHero title="Events" description="From professional development workshops to social events, URMC brings students together to learn, connect, and grow." image={hero} imageAlt="URMC members gathered for a campus event" className="events-hero">
        <a className="redesign-button redesign-button--gold" href={SLACK_URL} target="_blank" rel="noreferrer">Join our Slack<img src={slackIcon} alt="" /></a>
        <a className="redesign-button" href={INSTAGRAM_RECAP_URL} target="_blank" rel="noreferrer">View Recaps<img src={instagramIcon} alt="" /></a>
      </RedesignHero>
      <section className="events-calendar-section" aria-labelledby="events-calendar-title">
        <h2 id="events-calendar-title" className="redesign-section-title">Events Calendar</h2>
        <div className="events-calendar-frame"><iframe src={CALENDAR_URL} title="URMC Google Calendar" /></div>
      </section>
      <section className="featured-events" aria-labelledby="featured-events-title">
        <div className="featured-events-heading">
          <h2 id="featured-events-title" className="redesign-section-title">Featured Events</h2>
          <p>Explore some of the events that have shaped the URMC community over the past few semesters.</p>
        </div>
        <div className="featured-events-grid">
          {FEATURED_EVENTS.map(event => (
            // To restore dialogs, replace this div with the original button:
            // <button key={event.id} type="button" className={`featured-event-card featured-event-card--${event.id}`} onClick={() => setSelectedEvent(event)} aria-label={`View ${event.title}`} aria-haspopup="dialog">
            <div key={event.id} className={`featured-event-card featured-event-card--${event.id}`}>
              <img src={event.image} alt={`${event.title} flyer`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>
      {/* {selectedEvent && <FeaturedEventDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} instagramUrl={INSTAGRAM_URL} />} */}
    </main>
  );
}
