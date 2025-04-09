import { useEffect, useState } from "react";
import group from "../images/urmcfa2024.png";
import blue_ellipse from "../images/blue_ellipse.png";
import purple_ellipse from "../images/purple_ellipse.png";
import About_us from "./About_us.js";
import { useScale } from "../hooks/useScale.js";
import Navbar from "../components/Navbar.js";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useScale();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="home">
        <Navbar />
        <div className="home-content">
          <h1 className="header">
            UNDERREPRESENTED MINORITIES IN
            <br />
            COMPUTING
          </h1>
          <h2 className="sub-header">
            Building a supportive community where all can find success.
          </h2>
        </div>

        <div className="images">
          <img
            src={blue_ellipse}
            className="blue_ellipse"
            alt="Blue ellipse background"
          />
          <img
            src={purple_ellipse}
            className="purple_ellipse"
            alt="Purple ellipse background"
          />
          <img src={group} className="group" alt="URMC group photo" />
        </div>
      </div>

      <About_us />
    </>
  );
}
