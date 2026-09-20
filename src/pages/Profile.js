import { useMemo, useState } from "react";
import "../styles/profile.css";

/**
 * Profile
 * ------------------------------------------------------------------
 * Member profile settings page: an identity panel (avatar, name,
 * headline, major/class year) next to a tabbed form — General,
 * Contact & links.
 *
 * This component is UI-only — it manages its own form state and
 * calls `onSave` with the current values. Wire `onSave` up to
 * whatever API call saves the member's profile, and pass
 * `initialProfile` down from wherever the signed-in member's data
 * is loaded (context, a hook, etc).
 *
 * Usage (e.g. in App.js, alongside your other routes):
 *   <Profile initialProfile={member} onSave={updateMember} />
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

export default function Profile({ initialProfile = {}, memberSince, onSave }) {
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, ...initialProfile });
  const [activeTab, setActiveTab] = useState("general");
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  const initials = useMemo(
    () => getInitials(profile.firstName, profile.lastName),
    [profile.firstName, profile.lastName]
  );

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Your name";

  function update(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus("saving");
    try {
      await onSave?.(profile);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="profile">
      <form className="profile-layout" onSubmit={handleSave}>
        {/* Identity panel */}
        <aside className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">
            {initials}
          </div>
          <button type="button" className="profile-avatar-edit">
            Change photo
          </button>

          <h1 className="profile-identity-name">{fullName}</h1>
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

                <Field label="Pronouns">
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

                <Field label="Class year">
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

                <Field label="Current location">
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

          <div className="profile-actions">
            {status === "saved" && (
              <span className="profile-saved" role="status">
                Changes saved
              </span>
            )}
            <button type="submit" className="profile-save" disabled={status === "saving"}>
              {status === "saving" ? "Saving\u2026" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}