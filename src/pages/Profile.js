import { useEffect, useRef, useState } from "react";
import "../styles/profile.css";
import pinIcon from "../images/pin.svg";
import "../styles/redesign-hero.css";
import { useAuth } from "../contexts/AuthContext.js";
import { currentSemesterLabel } from "../lib/semester.js";
import {
  loadMyProfile,
  replaceHeadshot,
  updateMyProfile,
  validateHeadshot,
} from "../lib/profile.js";

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
 * Profile data and points come from Supabase for the signed-in member.
 * Edits are saved with update_my_profile, which only accepts the fields
 * listed in EDITABLE_FIELDS. Action Items and Event Attendance are still
 * sample data until there is a backend for them.
 */

// ------------------------------------------------------------------
// Edit form (shown in place of Action Items when editing)
// ------------------------------------------------------------------

const TABS = [
  { id: "general", label: "General" },
  { id: "contact", label: "Contact & links" },
];

const EDITABLE_FIELDS = [
  "first_name",
  "last_name",
  "major",
  "graduation_year",
  "bio",
  "ask_about",
  "linkedin_url",
  "instagram_url",
];

const MAX_TOPICS = 10;

// Form inputs are all strings; the database wants numbers, arrays and nulls.
function toForm(member) {
  return {
    first_name: member.first_name ?? "",
    last_name: member.last_name ?? "",
    major: member.major ?? "",
    graduation_year: member.graduation_year ? String(member.graduation_year) : "",
    bio: member.bio ?? "",
    ask_about: (member.ask_about ?? []).join(", "),
    linkedin_url: member.linkedin_url ?? "",
    instagram_url: member.instagram_url ?? "",
  };
}

function toPatchValue(field, value) {
  const trimmed = value.trim();
  if (field === "ask_about") {
    return trimmed ? trimmed.split(",").map((topic) => topic.trim()).filter(Boolean) : [];
  }
  if (field === "graduation_year") return trimmed ? Number(trimmed) : null;
  if (field === "first_name" || field === "last_name") return trimmed;
  return trimmed || null;
}

// Only the fields that changed, so untouched fields stay as they are.
export function buildPatch(initial, current) {
  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    const before = JSON.stringify(toPatchValue(field, initial[field]));
    const after = toPatchValue(field, current[field]);
    if (JSON.stringify(after) !== before) patch[field] = after;
  }
  return patch;
}

function validate(form) {
  if (!form.first_name.trim() || !form.last_name.trim()) return "First and last name are required.";
  if (form.graduation_year.trim() && !/^\d{4}$/.test(form.graduation_year.trim())) {
    return "Graduation year must be a four-digit year.";
  }
  if (toPatchValue("ask_about", form.ask_about).length > MAX_TOPICS) {
    return `Add at most ${MAX_TOPICS} career interests.`;
  }
  return null;
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

function ProfileForm({ member, onSaved, onBack }) {
  const [initial] = useState(() => toForm(member));
  const [profile, setProfile] = useState(initial);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ error: null, message: null });
  const fileInput = useRef(null);

  function update(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    const invalid = validate(profile);
    if (invalid) return setStatus({ error: invalid, message: null });

    const patch = buildPatch(initial, profile);
    if (Object.keys(patch).length === 0) return onBack();

    setSaving(true);
    setStatus({ error: null, message: null });
    try {
      onSaved(await updateMyProfile(patch));
      onBack();
    } catch (error) {
      setStatus({ error: error.message, message: null });
      setSaving(false);
    }
  }

  async function handlePhoto(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file || saving) return;
    const invalid = validateHeadshot(file);
    if (invalid) return setStatus({ error: invalid, message: null });

    setSaving(true);
    setStatus({ error: null, message: null });
    try {
      onSaved(await replaceHeadshot(member, file));
      setStatus({ error: null, message: "Photo updated." });
    } catch (error) {
      setStatus({ error: error.message, message: null });
    }
    setSaving(false);
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
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

          <div className="profile-field">
            <span className="profile-field-label">Photo</span>
            <span className="profile-field-hint">JPEG, PNG, or WebP, up to 5 MB. Saves right away.</span>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhoto}
              hidden
            />
            <button
              type="button"
              className="profile-photo-btn"
              onClick={() => fileInput.current.click()}
              disabled={saving}
            >
              {member.headshot_url ? "Change photo" : "Upload photo"}
            </button>
          </div>

          <div className="profile-grid">
            <Field label="First name" required>
              <input
                type="text"
                maxLength={100}
                value={profile.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                required
              />
            </Field>

            <Field label="Last name" required>
              <input
                type="text"
                maxLength={100}
                value={profile.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                required
              />
            </Field>

            <Field label="Major">
              <input
                type="text"
                maxLength={200}
                placeholder="Computer Science"
                value={profile.major}
                onChange={(e) => update("major", e.target.value)}
              />
            </Field>

            <Field label="Graduation year">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="2029"
                value={profile.graduation_year}
                onChange={(e) => update("graduation_year", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Career interests" hint="Separate topics with commas, up to 10.">
            <input
              type="text"
              placeholder="Software Engineering, Artificial Intelligence (AI)"
              value={profile.ask_about}
              onChange={(e) => update("ask_about", e.target.value)}
            />
          </Field>

          <Field label="Bio" hint="A few sentences other members can read.">
            <textarea
              rows={4}
              maxLength={2000}
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value)}
            />
          </Field>
        </section>
      )}

      {activeTab === "contact" && (
        <section className="profile-section" aria-labelledby="section-contact">
          <h2 id="section-contact" className="profile-section-title">
            Contact &amp; links
          </h2>

          <div className="profile-grid">
            <Field label="Email" hint="Comes from your Cornell Google account.">
              <input type="email" value={member.email ?? ""} readOnly />
            </Field>

            <Field label="NetID">
              <input type="text" value={member.netid ?? ""} readOnly />
            </Field>
          </div>

          <div className="profile-grid">
            <Field label="LinkedIn">
              <input
                type="url"
                maxLength={500}
                placeholder="https://www.linkedin.com/in/username"
                value={profile.linkedin_url}
                onChange={(e) => update("linkedin_url", e.target.value)}
              />
            </Field>

            <Field label="Instagram">
              <input
                type="url"
                maxLength={500}
                placeholder="https://www.instagram.com/username"
                value={profile.instagram_url}
                onChange={(e) => update("instagram_url", e.target.value)}
              />
            </Field>
          </div>
        </section>
      )}

      <div className="profile-form-actions">
        <button type="submit" className="redesign-button redesign-button--gold" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {(status.error || status.message) && (
          <p
            className={status.error ? "profile-form-error" : "profile-form-message"}
            role={status.error ? "alert" : "status"}
          >
            {status.error || status.message}
          </p>
        )}
      </div>
    </form>
  );
}

// ------------------------------------------------------------------
// Page
// ------------------------------------------------------------------

const NEAREST_REWARD = { name: "URMC Merch", points: 45 };

const ROLE_LABELS = { eboard: "Executive Board", advisor: "Advisor", ta: "Teaching Assistant" };

function memberStatus(member) {
  if (member.position) return member.position;
  const role = [].concat(member.role ?? []).find((r) => ROLE_LABELS[r]);
  return role ? ROLE_LABELS[role] : "Member";
}

const SAMPLE_ACTION_ITEMS = [
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

function ProfileStatus({ title, children }) {
  return (
    <div className="profile-page redesign-page">
      <div className="profile-page-header profile-page-status" aria-live="polite">
        <h1 className="profile-page-name">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, member: null, points: 0 });
  const [isEditing, setIsEditing] = useState(false);
  // Session refreshes hand us a new user object; only reload for a different user.
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    setState({ loading: true, error: null, member: null, points: 0 });
    loadMyProfile()
      .then(({ member, points }) => active && setState({ loading: false, error: null, member, points }))
      .catch((error) => active && setState({ loading: false, error: error.message, member: null, points: 0 }));
    return () => { active = false; };
  }, [userId]);

  if (authLoading || (user && state.loading)) {
    return <ProfileStatus title="Loading…"><p className="profile-page-hello">Checking sign-in…</p></ProfileStatus>;
  }

  if (!user) {
    return (
      <ProfileStatus title="My Profile">
        <p className="profile-page-hello">Sign in with your Cornell Google account to see your profile.</p>
        <button type="button" className="redesign-button redesign-button--gold profile-page-signin" onClick={signInWithGoogle}>
          Continue with Google
        </button>
      </ProfileStatus>
    );
  }

  if (state.error) {
    return (
      <ProfileStatus title="Something went wrong">
        <p className="profile-page-hello" role="alert">{state.error}</p>
      </ProfileStatus>
    );
  }

  if (!state.member) {
    return (
      <ProfileStatus title="No member record">
        <p className="profile-page-hello">
          You are signed in, but we could not find your URMC member record.{" "}
          <a href="mailto:urmc@cornell.edu">Contact URMC</a> for help linking your account.
        </p>
      </ProfileStatus>
    );
  }

  const member = state.member;
  const interests = member.ask_about ?? [];
  const profileComplete = Boolean(member.major && member.graduation_year);
  const actionItems = [
    {
      id: "profile",
      label: "Complete your member profile",
      description: "Add your major and graduation year to your profile.",
      done: profileComplete,
      flagged: !profileComplete,
    },
    ...SAMPLE_ACTION_ITEMS,
  ];
  const doneCount = actionItems.filter((item) => item.done).length;
  const pointsToReward = NEAREST_REWARD.points - state.points;

  return (
    <div className="profile-page redesign-page">
      {/* Header */}
      <div className="profile-page-header">
        <p className="profile-page-hello">Hello!</p>
        <h1 className="profile-page-name">
          {member.first_name} {member.last_name}
        </h1>

        <div className="profile-page-welcome-banner">
         <img className="profile-page-pin" src={pinIcon} alt="" aria-hidden="true" />
          <div>
            <p className="profile-page-welcome-title">Welcome to {currentSemesterLabel()}!</p>
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

            {member.headshot_url ? (
              <img className="profile-page-photo" src={member.headshot_url} alt={`${member.first_name} ${member.last_name}`} />
            ) : (
              <div className="profile-page-photo" aria-hidden="true">
                {member.first_name?.[0]}
              </div>
            )}

            <div className="profile-page-info-grid">
              <div>
                <p className="profile-page-label">NetID</p>
                <p className="profile-page-value">{member.netid}</p>
              </div>
              <div>
                <p className="profile-page-label">Major</p>
                <p className="profile-page-value">{member.major || "—"}</p>
              </div>
              <div>
                <p className="profile-page-label">Graduation Year</p>
                <p className="profile-page-value">{member.graduation_year || "—"}</p>
              </div>
              <div>
                <p className="profile-page-label">Status</p>
                <p className="profile-page-value">{memberStatus(member)}</p>
              </div>
            </div>

            <p className="profile-page-label">Career Interests</p>
            {interests.length > 0 ? (
              <div className="profile-page-tags">
                {interests.map((interest) => (
                  <span key={interest} className="profile-page-tag">
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="profile-page-muted-small">Add your interests with Edit Profile.</p>
            )}

            {member.bio && (
              <>
                <p className="profile-page-label profile-page-bio-label">Bio</p>
                <p className="profile-page-bio">{member.bio}</p>
              </>
            )}

            <button
              type="button"
              className="redesign-button profile-page-outline-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>

          <div className="profile-page-card">
            <div className="profile-page-card-row">
              <h2 className="profile-page-card-title">Points Tracker</h2>
              <span className="profile-page-big-number">{state.points}</span>
            </div>
            <p className="profile-page-muted">
              {pointsToReward > 0 ? (
                <>
                  Nearest reward:{" "}
                  <span className="profile-page-gold-text">
                    {NEAREST_REWARD.name} ({NEAREST_REWARD.points} pts)
                  </span>
                </>
              ) : (
                <>
                  You've earned <span className="profile-page-gold-text">{NEAREST_REWARD.name}</span>!
                </>
              )}
            </p>
            <a href="/points" className="redesign-button profile-page-outline-btn">
              How to Earn Points
            </a>
          </div>
        </div>

        {/* Right column: Action Items + Event Attendance, or the edit form */}
        <div className="profile-page-col">
          <div key={isEditing ? "edit" : "view"} className="profile-page-transition">
            {isEditing ? (
              <div className="profile-page-card profile-page-edit-card">
                <ProfileForm
                  member={member}
                  onSaved={(saved) => setState((prev) => ({ ...prev, member: { ...prev.member, ...saved } }))}
                  onBack={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <>
                <div className="profile-page-card">
                  <div className="profile-page-card-row">
                    <h2 className="profile-page-card-title">Action Items</h2>
                    <span className="profile-page-muted-small">
                      {doneCount}/{actionItems.length} done
                    </span>
                  </div>

                  <div className="profile-page-checklist">
                    {actionItems.map((item) => (
                      <div className="profile-page-check-item" key={item.id}>
                        <span
                          className={
                            "profile-page-checkbox" +
                            (item.done ? " profile-page-checkbox-done" : "")
                          }
                          aria-hidden="true"
                        >
                          {item.done ? "✓" : ""}
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
                  <p className="profile-page-coming-soon">More action items are coming soon.</p>
                </div>

                <div className="profile-page-card">
                  <div className="profile-page-card-row">
                    <h2 className="profile-page-card-title">Event Attendance</h2>
                    <p className="profile-page-attendance">
                      <span className="profile-page-gold-text">{SAMPLE_ATTENDANCE.attended}</span>
                      <span className="profile-page-muted-small">/{SAMPLE_ATTENDANCE.total}</span>
                    </p>
                  </div>
                  <p className="profile-page-coming-soon">Sample numbers. Attendance tracking is coming soon.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
