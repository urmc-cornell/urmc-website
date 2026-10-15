# Member portal authentication proposal

Reviewed September 27, 2026. Branch: `feat/member-portal-auth`.
This is a proposal, not an implemented authentication system. Database inspection was read-only.

## Recommendation and alternatives

Use Supabase Auth with Google OAuth as the initial sign-in method. Keep the existing React application and Supabase database. Students choose their Cornell Google account; trusted server-side logic links their authenticated identity to an existing member by canonical NetID. Use database permissions to enforce access.

| Option | Assessment |
| --- | --- |
| Supabase Auth + Google | Recommended: fits the installed Supabase client and avoids separate club passwords. Requires Google OAuth configuration and a Cornell account pilot. |
| Cornell institutional SSO through SAML/Shibboleth | Consider if authoritative student affiliation is required. Requires coordination with Cornell Identity Management and confirmation of Supabase SAML plan eligibility/pricing. |
| Supabase email code or magic link | Possible fallback for Cornell mailbox owners. Adds email delivery configuration and inbox friction; requires production SMTP. |
| Email/password | Adds password reset and verification flows without improving the desired student experience. |
| Separate authentication vendor | Possible, but introduces another identity integration to maintain alongside Supabase. No current requirement justifies it. |

Cornell documents Google Workspace accounts as NetID@cornell.edu. A Cornell account alone does not establish current student status or URMC membership. Treat identity verification and membership eligibility as separate checks.

## Findings from this repo and database

- React 18/Create React App; `@supabase/supabase-js` is already installed. `src/lib/supabaseClient.js` supports production and staging.
- Pages query Supabase directly from the browser; a custom authentication backend is not currently required by this architecture.
- `src/App.js` selects pages with `window.location.pathname`. Add explicit login, callback, and portal handling, and verify hosting serves the app on direct visits to those paths.
- Production has 388 member records and zero Supabase Auth users at inspection time. `members.netid` is unique; `members.id` is referenced by points history. There is no auth-user link column.
- One NetID is noncanonical and one contains an `@` sign; investigate before linking. These counts may refer to the same row. Lowercase/trim normalization alone found no duplicate groups, but canonicalization still needs collision checks.
- RLS is enabled, but policies allow unrestricted public SELECT, INSERT, and UPDATE on members, points_tracking, and events. Anonymous table grants also permit those operations. A login page alone cannot protect this data.
- Points.js downloads member points for ranking and allows arbitrary NetID lookup. Leadership and TA pages read members directly. Their data access must be adjusted alongside permissions.
- The `summed_points` view hardcodes `sp25`; replace that assumption for semester-based portal totals. Review view execution permissions as part of RLS work.
- Population scripts currently use the anonymous key. Removing public writes requires moving these workflows to a trusted administrative execution context; never ship privileged credentials to the browser.

## Identity and member linking

1. Student clicks “Continue with Cornell Google.” Start Google OAuth through Supabase with minimal identity scopes and a Cornell domain hint.
2. Google authenticates the student; Supabase establishes the application session. Prefer a PKCE flow with an explicit callback and code exchange.
3. Trusted logic checks the Google identity and verified Cornell email before deriving the NetID. A browser-supplied NetID, member ID, or editable user metadata must never establish ownership. If enforcing Cornell Workspace membership, validate Google's signed hosted-domain claim through a trusted path; do not assume Supabase exposes or enforces it without verification during implementation.
4. Match the canonical NetID to exactly one existing member. Add a nullable, unique `members.auth_user_id` foreign key to `auth.users.id`. Preserve `members.id`, points, and existing roles. Perform first-time linking atomically on the server; refuse conflicting or already-claimed matches.
5. Authorize subsequent access using the stable authenticated user ID and stored member link. Students cannot edit either identity field or assign roles.

Use a before-user-created hook to reject non-Cornell signups, with Google as the only initial provider. That hook runs only at signup; ongoing authorization must still use protected database state. The Google `hd=cornell.edu` request parameter is a user-interface hint, not a security boundary.

For version one, recommend linking existing members only. An unmatched Cornell user sees a join/contact flow without another member's data. New-member self-registration can follow once membership rules are defined. Conflicts require administrative review rather than silently creating duplicate members. Do not auto-promote anyone based on client input or profile data.

## Access model

- Anonymous visitors: deliberately published events, directory fields, and limited leaderboard aggregates only.
- Linked members: their own private profile, points history, and action progress.
- Profile editing: allow only approved fields such as major, graduation year, and career interests through narrow column grants or a validated function. Row ownership alone does not prevent role or identity changes.
- Administrators: explicit trusted permissions for points, membership, events, and roles. A displayed “Executive Board” label need not automatically grant application administrator powers.
- Identity linking: trusted function only, no client write access to the link. Any privileged function needs fixed search_path, caller validation, minimal grants, and qualified object references.

Remove permissive policies rather than just adding restrictive-looking ones: permissive policies combine with OR. Publish intentionally limited directory/leaderboard projections or functions with audited grants, and keep private profile additions out of public access. Check storage policies if profile uploads are enabled.

## Figma portal scope

Reference: https://www.figma.com/design/KDYlTmVUxhdwh5m6hHL328/Website-Redesign-2026?node-id=1346-1659&m=dev

The frame contains a member profile/edit action, career interests, status, action items, event attendance, points/reward progress, a semester announcement, and sign-out.

- Existing member fields cover NetID, name, major, graduation year, role/status, and headshot.
- Career interests need a dedicated field or profile table; do not silently reuse `ask_about`.
- Survey completion needs a defined source of truth and semester-scoped completion records. Opening a survey link does not prove submission.
- Attendance needs an explicit definition. Points can have no event and multiple adjustments; point rows are not automatically attendance. Define a unique member/event attendance record or a validated counting rule.
- Points totals should aggregate the authenticated member's ledger for the selected semester. Reward thresholds and announcements need agreed content/configuration; the Figma examples are not production facts.
- Pre-fill and lock verified NetID even though the mockup's action text suggests adding it manually.

## Delivery order and validation

1. Reconcile staging/production schema differences, audit NetID exceptions, design least-privilege policies, and adapt public reads and population scripts.
2. Configure a URMC-maintained Google OAuth application and Supabase Google provider separately for staging and production. Register provider callback URLs and exact app redirect allowlists. Keep the OAuth secret in Supabase configuration.
3. Pilot with real Cornell accounts to establish whether Cornell's third-party application policies allow the flow or require IT approval. Confirm provider-issued identity claims before finalizing the linking mechanism.
4. Implement auth linking, domain restrictions, session handling, loading/error states, sign-out, and the protected portal entry point in staging.
5. Build the Figma profile and points experience, then profile editing and action/attendance tracking once their data rules are agreed.
6. Verify valid/invalid domains, existing/unmatched/conflicting members, repeated and concurrent first logins, refresh/direct callback navigation, canceled login, session expiry, and sign-out. Test direct API attempts by anonymous users and a second member, including forbidden role, identity, and points updates. Confirm public pages and trusted data scripts still work.

Configuration access, Cornell pilot results, unmatched-user policy, and definitions for attendance/survey completion are implementation dependencies. No remote changes or application code were made for this proposal.

## Sources

- Cornell Google Workspace for students: https://it.cornell.edu/gsuite-student
- Supabase Google sign-in: https://supabase.com/docs/guides/auth/social-login/auth-google
- Google hosted-domain validation: https://developers.google.com/identity/openid-connect/openid-connect
- Supabase signup hooks: https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Cornell federated login: https://it.cornell.edu/shibboleth/federated-login-cornell-university-shibboleth
- Supabase application SAML SSO: https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml
- Supabase passwordless email: https://supabase.com/docs/guides/auth/auth-email-passwordless
- Production SMTP: https://supabase.com/docs/guides/auth/auth-smtp
