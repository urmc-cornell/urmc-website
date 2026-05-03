import '../../styles/mission.css';
import missionBanner from '../../images/home/mission-banner.jpg';

export default function MissionSection() {
  return (
    <section className="mission">
      <img src={missionBanner} alt="" className="mission-bg" aria-hidden="true" />
      <div className="mission-overlay" aria-hidden="true" />
      <p className="mission-text">
        The <span className="mission-highlight">purpose of URMC</span> is to advance diversity in computing by supporting
        and empowering Black, Latinx, and Indigenous students pursuing careers
        in technology.
      </p>
    </section>
  );
}
