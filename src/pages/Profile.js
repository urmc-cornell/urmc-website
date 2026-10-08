import { useState } from "react";
import "../styles/profile.css";

/**
 * Profile
 * ------------------------------------------------------------------
 * Member profile page, built from the Figma "Member Portal" frame:
 * a full-width header (greeting, name, welcome banner), then two
 * columns. The left column (My Profile, Points Tracker) never changes.
 * The right column shows Action Items and Event Attendance, and
 * clicking "Edit Profile" swaps it for the edit form (ProfileForm,
 * defined further down in this file) with a short fade/slide.
 *
 * UI only for now: every value below is SAMPLE data, and the edit form
 * keeps its values in local state. Nothing is loaded from or saved to a
 * backend yet; wiring this to real member data, and saving (with a Save
 * button), come in a follow-up PR.
 */

// ------------------------------------------------------------------
// Edit form (shown in place of Action Items when editing)
// ------------------------------------------------------------------

const TABS = [
  { id: "general", label: "General" },
  { id: "contact", label: "Contact & links" },
];

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  preferredName: "",
  pronouns: "",
  major: "",
  classYear: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  website: "",
};

function Field({ label, hint, required, children }) {
  return (
    <label className="profile-field">
      <span className="profile-field-label">
        {label}
        {required && <span className="profile-field-required">*</span>}
      </span>
      {hint && <span className="profile-field-hint">{hint}</span>}
      {children}
    </label>
  );
}

function ProfileForm({ initialProfile = {}, onBack }) {
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, ...initialProfile });
  const [activeTab, setActiveTab] = useState("general");

  function update(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  return (
    // No submit button yet (saving is a follow-up PR), so just make sure
    // pressing Enter can't reload the page.
    <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
      {onBack && (
        <button type="button" className="profile-back-link" onClick={onBack}>
          &larr; Back to profile
        </button>
      )}

      <nav className="profile-tabs" aria-label="Profile sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={"profile-tab" + (activeTab === tab.id ? " profile-tab-active" : "")}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "general" && (
        <section className="profile-section" aria-labelledby="section-general">
          <h2 id="section-general" className="profile-section-title">
            General
          </h2>

          <div className="profile-grid">
            <Field label="First name" required>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </Field>

            <Field label="Last name" required>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </Field>

            <Field label="Preferred name" hint="If you go by a different name, add it here.">
              <input
                type="text"
                value={profile.preferredName}
                onChange={(e) => update("preferredName", e.target.value)}
              />
            </Field>

            <Field label="Pronouns" hint="Add the pronouns you'd like others to use.">
              <input
                type="text"
                placeholder="she/her, he/him, they/them..."
                value={profile.pronouns}
                onChange={(e) => update("pronouns", e.target.value)}
              />
            </Field>

            <Field label="Major">
              <input
                type="text"
                placeholder="Computer Science"
                value={profile.major}
                onChange={(e) => update("major", e.target.value)}
              />
            </Field>

            <Field label="Graduation year">
              <input
                type="text"
                placeholder="2029"
                value={profile.classYear}
                onChange={(e) => update("classYear", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Headline" hint="One line other members will see next to your name.">
            <input
              type="text"
              placeholder="CS @ Cornell, interested in ML"
              value={profile.headline}
              onChange={(e) => update("headline", e.target.value)}
            />
          </Field>
        </section>
      )}

      {activeTab === "contact" && (
        <section className="profile-section" aria-labelledby="section-contact">
          <h2 id="section-contact" className="profile-section-title">
            Contact &amp; links
          </h2>

          <Field label="Email" required>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </Field>

          <div className="profile-grid">
            <Field label="Phone number" hint="Used for event reminders only.">
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={profile.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>

            <Field label="Current location" hint="Where you're currently based.">
              <input
                type="text"
                placeholder="Ithaca, NY"
                value={profile.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </Field>
          </div>

          <div className="profile-grid">
            <Field label="GitHub">
              <input
                type="text"
                placeholder="github.com/username"
                value={profile.github}
                onChange={(e) => update("github", e.target.value)}
              />
            </Field>

            <Field label="LinkedIn">
              <input
                type="text"
                placeholder="linkedin.com/in/username"
                value={profile.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
              />
            </Field>

            <Field label="Personal website">
              <input
                type="text"
                placeholder="yourname.dev"
                value={profile.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </Field>
          </div>
        </section>
      )}
    </form>
  );
}

// ------------------------------------------------------------------
// Page
// ------------------------------------------------------------------

const SAMPLE_MEMBER = {
  firstName: "Alex",
  lastName: "Rivera",
  netId: "xx123",
  major: "Computer Science",
  graduationYear: "2027",
  status: "Executive Board",
  careerInterests: ["Software Engineering", "Artificial Intelligence (AI)"],
};

const SAMPLE_POINTS = {
  total: 13,
  nearestReward: "URMC Merch (45 pts)",
};

const SAMPLE_ACTION_ITEMS = [
  {
    id: "profile",
    label: "Complete your member profile",
    description: "Add your NetID, major, and graduation year to your profile.",
    done: true,
    flagged: true,
  },
  {
    id: "survey",
    label: "Fill out the semester survey",
    description: "Help us plan events that match your interests",
    done: false,
    flagged: true,
  },
  {
    id: "gbm",
    label: "Attend a General Body Meeting",
    description: "Earn 10 points and meet fellow URMC members",
    done: false,
    flagged: false,
  },
];

const SAMPLE_ATTENDANCE = { attended: 5, total: 14 };

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const member = SAMPLE_MEMBER;
  const doneCount = SAMPLE_ACTION_ITEMS.filter((item) => item.done).length;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-page-header">
        <p className="profile-page-hello">Hello!</p>
        <h1 className="profile-page-name">
          {member.firstName} {member.lastName}
        </h1>

        <div className="profile-page-welcome-banner">
          <span className="profile-page-pin" aria-hidden="true">
            📌
          </span>
          <div>
            <p className="profile-page-welcome-title">Welcome to Fall 2026!</p>
            <p className="profile-page-welcome-text">
              We're so excited to kick off another semester with you all. Check the
              events calendar and stay active!
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="profile-page-body">
        {/* Left column: stays put whether or not the form is open */}
        <div className="profile-page-col">
          <div className="profile-page-card">
            <h2 className="profile-page-card-title">My Profile</h2>

            <div className="profile-page-photo" aria-hidden="true">
              {member.firstName[0]}
            </div>

            <div className="profile-page-info-grid">
              <div>
                <p className="profile-page-label">NetID</p>
                <p className="profile-page-value">{member.netId}</p>
              </div>
              <div>
                <p className="profile-page-label">Major</p>
                <p className="profile-page-value">{member.major}</p>
              </div>
              <div>
                <p className="profile-page-label">Graduation Year</p>
                <p className="profile-page-value">{member.graduationYear}</p>
              </div>
              <div>
                <p className="profile-page-label">Status</p>
                <p className="profile-page-value">{member.status}</p>
              </div>
            </div>

            <p className="profile-page-label">Career Interests</p>
            <div className="profile-page-tags">
              {member.careerInterests.map((interest) => (
                <span key={interest} className="profile-page-tag">
                  {interest}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="profile-page-outline-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>

          <div className="profile-page-card">
            <div className="profile-page-card-row">
              <h2 className="profile-page-card-title">Points Tracker</h2>
              <span className="profile-page-big-number">{SAMPLE_POINTS.total}</span>
            </div>
            <p className="profile-page-muted">
              Nearest reward:{" "}
              <span className="profile-page-gold-text">{SAMPLE_POINTS.nearestReward}</span>
            </p>
            <button type="button" className="profile-page-outline-btn">
              How to Earn Points
            </button>
          </div>
        </div>

        {/* Right column: Action Items + Event Attendance, or the edit form */}
        <div className="profile-page-col">
          <div key={isEditing ? "edit" : "view"} className="profile-page-transition">
            {isEditing ? (
              <div className="profile-page-card profile-page-edit-card">
                <ProfileForm
                  initialProfile={{
                    firstName: member.firstName,
                    lastName: member.lastName,
                    major: member.major,
                    classYear: member.graduationYear,
                  }}
                  onBack={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <>
                <div className="profile-page-card">
                  <div className="profile-page-card-row">
                    <h2 className="profile-page-card-title">Action Items</h2>
                    <span className="profile-page-muted-small">
                      {doneCount}/{SAMPLE_ACTION_ITEMS.length} done
                    </span>
                  </div>

                  <div className="profile-page-checklist">
                    {SAMPLE_ACTION_ITEMS.map((item) => (
                      <div className="profile-page-check-item" key={item.id}>
                        <span
                          className={
                            "profile-page-checkbox" +
                            (item.done ? " profile-page-checkbox-done" : "")
                          }
                          aria-hidden="true"
                        >
                          {item.done ? "\u2713" : ""}
                        </span>
                        <div>
                          <p className="profile-page-check-label">
                            {item.label}
                            {item.flagged && (
                              <span className="profile-page-flag-dot" aria-hidden="true" />
                            )}
                          </p>
                          <p className="profile-page-check-description">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="profile-page-card profile-page-card-row">
                  <h2 className="profile-page-card-title">Event Attendance</h2>
                  <p className="profile-page-attendance">
                    <span className="profile-page-gold-text">{SAMPLE_ATTENDANCE.attended}</span>
                    <span className="profile-page-muted-small">/{SAMPLE_ATTENDANCE.total}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}