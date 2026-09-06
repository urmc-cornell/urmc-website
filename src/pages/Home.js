import Navbar from "../components/Navbar.js";
import HeroSection from "../components/home/HeroSection.js";
import MissionSection from "../components/home/MissionSection.js";
import SponsorsCarousel from "../components/home/SponsorsCarousel.js";
import PillarsSection from "../components/home/PillarsSection.js";
import HappeningsSection from "../components/home/HappeningsSection.js";
import "../styles/home.css";

export default function Home() {

  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <SponsorsCarousel />
      <PillarsSection />
      <HappeningsSection />
    </div>
  );
}
