import { supabase } from './supabaseClient.js';
import { currentSemester } from './semester.js';

export const HEADSHOT_BUCKET = 'member-headshots';
export const HEADSHOT_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const HEADSHOT_MAX_BYTES = 5 * 1024 * 1024;

const PROFILE_COLUMNS = `id, netid, email, first_name, last_name, major, graduation_year,
  role, position, bio, ask_about, linkedin_url, instagram_url, headshot_url`;

// There is no attendance table yet: sign-ins are recorded as points rows whose
// reason starts with "Event Attendance". The same event counts once, since some
// events have repeat rows.
export function countAttendance(rows) {
  const reasons = rows.map((row) => (row.reason ?? '').trim().toLowerCase());
  return new Set(reasons.filter((reason) => reason.startsWith('event attendance'))).size;
}

// Returns { member, points, attendance } for the signed-in user, or
// { member: null } when the account has no linked member record yet.
export async function loadMyProfile() {
  const { data: memberId, error: linkError } = await supabase.rpc('link_my_member');
  if (linkError) throw linkError;
  if (!memberId) return { member: null, points: 0 };

  const semester = currentSemester();
  const [member, points, hosted] = await Promise.all([
    supabase.from('members').select(PROFILE_COLUMNS).eq('id', memberId).single(),
    supabase.from('points_tracking').select('points, reason').eq('member_id', memberId).eq('semester', semester),
    supabase.rpc('get_semester_event_count', { p_semester: semester }),
  ]);
  if (member.error) throw member.error;
  if (points.error) throw points.error;
  // One card's total isn't worth losing the whole profile page over.
  if (hosted.error) console.error('Error loading event count:', hosted.error);
  const attended = countAttendance(points.data);
  return {
    member: member.data,
    points: points.data.reduce((sum, row) => sum + Number(row.points || 0), 0),
    attendance: { attended, hosted: Math.max(hosted.data ?? 0, attended) },
  };
}

// Only send the fields that changed; the database rejects the whole patch if any
// field is unknown or protected.
export async function updateMyProfile(patch) {
  const { data, error } = await supabase.rpc('update_my_profile', { p_patch: patch });  if (error) throw error;
  return data;
}

// Path of an object in the member-headshots bucket, or null for legacy images.
export function headshotPathFromUrl(url) {
  const marker = `/${HEADSHOT_BUCKET}/`;
  const index = url ? url.indexOf(marker) : -1;
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
}

export function validateHeadshot(file) {
  if (!HEADSHOT_TYPES[file.type]) return 'Headshots must be JPEG, PNG, or WebP.';
  if (file.size > HEADSHOT_MAX_BYTES) return 'Headshots must be 5 MB or smaller.';
  return null;
}

// Upload, save the new path, then remove the member's previous image. If saving
// fails, the unused upload is removed instead.
export async function replaceHeadshot(member, file) {
  const path = `${member.id}/${crypto.randomUUID()}.${HEADSHOT_TYPES[file.type]}`;
  const storage = supabase.storage.from(HEADSHOT_BUCKET);
  const { error: uploadError } = await storage.upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  let profile;
  try {
    profile = await updateMyProfile({ headshot_path: path });
  } catch (error) {
    await storage.remove([path]).catch(() => {});
    throw error;
  }

  const previous = headshotPathFromUrl(member.headshot_url);
  if (previous && previous !== path && previous.startsWith(`${member.id}/`)) {
    await storage.remove([previous]).catch(() => {});
  }
  return profile;
}
