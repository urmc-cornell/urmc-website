// Position-based grouping is kept here alongside the labels shown in the UI.
export const LEADERSHIP_CATEGORIES = [
  { label: 'Full Team', key: 'all' },
  { label: 'Presidents', key: 'presidents', positions: /president/i },
  { label: 'Events', key: 'events', positions: /academic|corporate|event|professional development/i },
  { label: 'Community Building', key: 'community-building', positions: /community|mentorship|social/i },
  { label: 'External', key: 'external', positions: /external|design|outreach|public relations/i },
  { label: 'Internal', key: 'internal', positions: /internal|secretary|treasurer|web development/i },
  { label: 'Advisors', key: 'advisors' },
];
