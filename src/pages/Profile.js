import { useMemo, useState } from "react";
import "../styles/profile.css";

/**
 * Profile
 * ------------------------------------------------------------------
 * Member profile page: an identity panel (avatar initials, name,
 * headline, major/graduation year) next to a tabbed form — General and
 * Contact & links.
 *
 * UI only for now: the form keeps its values in local state, and
 * nothing is loaded from or saved to a backend yet. Saving (and the
 * Save button) comes in a follow-up PR.
 */

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

function getInitials(firstName, lastName) {
  const a = firstName.trim()[0] ?? "";
  const b = lastName.trim()[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

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

export default function Profile({ initialProfile = {}, memberSince }) {
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, ...initialProfile });
  const [activeTab, setActiveTab] = useState("general");

  const initials = useMemo(
    () => getInitials(profile.firstName, profile.lastName),
    [profile.firstName, profile.lastName]
  );

  // The "Your name" fallback is a placeholder, not real data, so it gets
  // a visually distinct (muted) style.
  const hasName = Boolean(profile.firstName || profile.lastName);
  const fullName = hasName
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ")
    : "Your name";

  function update(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="profile">
      {/* There's no submit button yet (saving is a follow-up PR), so just
          make sure pressing Enter can't reload the page. */}
      <form className="profile-layout" onSubmit={(e) => e.preventDefault()}>
        {/* Identity panel */}
        <aside className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">
            {initials}
          </div>

          <div className="profile-identity-text">
            <h1
              className={
                "profile-identity-name" +
                (!hasName ? " profile-identity-name-placeholder" : "")
              }
            >
              {fullName}
            </h1>
            {profile.headline && (
              <p className="profile-identity-headline">{profile.headline}</p>
            )}
            {(profile.major || profile.classYear) && (
              <p className="profile-identity-meta">
                {[profile.major, profile.classYear].filter(Boolean).join(" \u00b7 ")}
              </p>
            )}

            {memberSince && (
              <p className="profile-identity-since">URMC member since {memberSince}</p>
            )}
          </div>
        </aside>

        {/* Tabbed content */}
        <div className="profile-content">
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
        </div>
      </form>
    </div>
  );
}
