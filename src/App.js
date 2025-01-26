import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About_us from "./pages/About_us.js";
import Events from "./pages/Events.js";
import Getting_involved from "./pages/Getting_involved.js";
import Leadership from "./pages/Leadership.js";
import Sponsors from "./pages/Sponsors.js";
import Points from "./pages/Points.js";

//fonts
import "./fonts/static/Montserrat-Light.ttf";
import "./fonts/static/Montserrat-Medium.ttf";
import Home from './pages/Home.js';
import Ta_directory from './pages/Ta_directory';

function App() {
  let component;
  const isHomePage = window.location.pathname === "/";

  switch (window.location.pathname) {
    case "/":
      component = <Home className="body"/>
      break
    case "/about-us":
      component = <About_us />
      break
    case "/events":
      component = <Events />
      break
    case "/ta-directory":
      component = <Ta_directory />
      break
    case "/getting-involved":
      component = <Getting_involved />
      break
    case "/leadership":
      component = <Leadership />
      break
    case "/sponsors":
      component = <Sponsors />
      break
    case "/points":
      component = <Points />
      break
  }

  return (
    <div className="page-container">
      <div className="content-wrap">
        {!isHomePage && <Navbar />}
        <div className="body">
          {component}
        </div>
        <div className="foot-params">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
