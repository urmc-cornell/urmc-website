import '../../styles/mission.css';

// TODO: When Figma rate limit resets, extract node 107:149 (IMG_1553):
//   curl -L "<figma-asset-url>" -o src/images/homes/mission-banner.jpg
// Then: import missionBanner from '../../images/homes/mission-banner.jpg';
// Replace .mission-bg-placeholder with: <img src={missionBanner} alt="" className="mission-bg" />

export default function MissionSection() {
  return (
    <section className="mission">
      <div className="mission-bg-placeholder" aria-hidden="true" />
      <div className="mission-overlay" aria-hidden="true" />
      <p className="mission-text">
        The purpose of URMC is to advance diversity in computing by supporting
        and empowering Black, Latinx, and Indigenous students pursuing careers
        in technology.
      </p>
    </section>
  );
}
