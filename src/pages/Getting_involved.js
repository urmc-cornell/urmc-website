import "../styles/getting_involved.css";
import "../styles/home.css";
export default function Getting_involved() {
  return (
    <div className="getting-involved-page">
      <h1 className="getting-involved">Getting Involved</h1>
      <div className="grid-container">
        <div className="">
          <div className="text-background">
            <h1 className="header-text"> COMPANIES </h1>
            <h3 className="subheader-text">
              Send us an email to connect with our Corporate directors and
              receive our Sponsorship Packet! You won't regret it!
            </h3>
          </div>
          <div className="button-div">
            <a class="btn btn-1" href="mailto:urmc@cornell.edu" target="_blank">
              SPONSOR US
            </a>
          </div>
        </div>
        <div className="">
          <div className="text-background">
            <h1 className="header-text"> STUDENTS </h1>
            <h3 className="subheader-text">
              Find out about URMC events, on-campus and off-campus
              opportunities, and other events happening within the CIS
              community!
            </h3>
          </div>
          <div className="button-div">
            <a
              class="btn btn-1"
              href="https://join.slack.com/t/urmc/shared_invite/zt-2dy8ndtoy-~6zcRR2skt7Z5iT5iAyIBg"
              target="_blank"
            >
              JOIN THE SLACK
            </a>
          </div>
        </div>
      </div>

      <div className="grid-container">
        <div className="">
          <div className="text-background">
            <h1 className="header-text"> ALUMNI </h1>
            <h3 className="subheader-text">
              Are you an alumni or current student who wants to keep up with
              URMC? Sign up to receive updates about URMC!{" "}
            </h3>
          </div>
          <div className="button-div">
            <a
              class="btn btn-1"
              href="https://docs.google.com/forms/d/e/1FAIpQLSc8c-drC3WBcVMqknx09q6-cBWRYeCbZYN1tBu98RM4CuDoTg/viewform"
              target="_blank"
            >
              JOIN THE LISTSERV
            </a>
          </div>
        </div>
        <div className="">
          <div className="text-background">
            <h1 className="header-text"> DONATIONS </h1>
            <h3 className="subheader-text">
              Help URMC continue to have the resources to empower URM's in tech
              to accomplish their dreams.{" "}
            </h3>
          </div>
          <div className="button-div">
            <a
              class="btn btn-1"
              href="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=702"
              target="_blank"
            >
              DONATE
            </a>
          </div>
        </div>
      </div>
      <p></p>
    </div>
  );
}
