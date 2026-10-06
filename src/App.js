import "./App.css";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import AboutUs from "./pages/About_us.js";
import Events from "./pages/Events.js";
import GettingInvolved from "./pages/Getting_involved.js";
import Leadership from "./pages/Leadership.js";
import Sponsors from "./pages/Sponsors.js";
import Points from "./pages/Points.js";
import Home from "./pages/Home.js";
import TaDirectory from "./pages/Ta_directory.js";
import Leaderboard from "./pages/Leaderboard.js";

const PAGES = {
  '/': Home,
  '/about-us': AboutUs,
  '/events': Events,
  '/ta-directory': TaDirectory,
  '/getting-involved': GettingInvolved,
  '/leadership': Leadership,
  '/sponsors': Sponsors,
  '/points': Points,
  '/leaderboard': Leaderboard,
};

function App() {
  const isHomePage = window.location.pathname === '/';
  const Page = PAGES[window.location.pathname];

  return (
    <div className="page-container">
      <div className="content-wrap">
        {!isHomePage && <Navbar />}
        <div className="body">{Page && <Page />}</div>
        <div className="foot-params">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
