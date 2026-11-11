import { countAttendance, headshotPathFromUrl, loadMyProfile, replaceHeadshot, validateHeadshot } from './profile.js';
import { buildPatch } from '../pages/Profile.js';
import { currentSemester } from './semester.js';
import { supabase } from './supabaseClient.js';
jest.mock('./supabaseClient.js', () => ({ supabase: { rpc: jest.fn(), from: jest.fn(), storage: { from: jest.fn() } } }));

function query(result) {
  const chain = { select: () => chain, eq: () => chain, single: () => Promise.resolve(result), then: (r, j) => Promise.resolve(result).then(r, j) };
  return chain;
}

// jsdom has no crypto.randomUUID; browsers on https and localhost do.
globalThis.crypto = { randomUUID: () => 'new-uuid' };

beforeEach(() => jest.resetAllMocks());

test('unlinked accounts return no member without reading tables', async () => {
  supabase.rpc.mockResolvedValue({ data: null, error: null });
  await expect(loadMyProfile()).resolves.toEqual({ member: null, points: 0 });
  expect(supabase.from).not.toHaveBeenCalled();
});

test('loads the linked member, this semester\'s points, and attendance', async () => {
  let hosted = { data: 4, error: null };
  supabase.rpc.mockImplementation(name => Promise.resolve(
    name === 'link_my_member' ? { data: 'm1', error: null } : hosted));
  const points = query({ data: [
    { points: 10, reason: 'Event Attendance - GBody' },
    { points: 3, reason: 'Merch raffle' },
  ], error: null });
  const eq = jest.spyOn(points, 'eq');
  supabase.from.mockImplementation(table => table === 'members'
    ? query({ data: { id: 'm1', first_name: 'Alex' }, error: null })
    : points);
  await expect(loadMyProfile()).resolves.toEqual({
    member: { id: 'm1', first_name: 'Alex' },
    points: 13,
    attendance: { attended: 1, hosted: 4 },
  });
  expect(eq).toHaveBeenCalledWith('semester', currentSemester());
  expect(supabase.rpc).toHaveBeenCalledWith('get_semester_event_count', { p_semester: currentSemester() });

  // If the count is unavailable the page still loads, showing 1/1 rather than 1/0.
  const logError = jest.spyOn(console, 'error').mockImplementation(() => {});
  hosted = { data: null, error: new Error('not found') };
  expect((await loadMyProfile()).attendance).toEqual({ attended: 1, hosted: 1 });
  logError.mockRestore();
});

test('attendance counts each event once and skips other points', () => {
  const rows = [
    { reason: 'Event Attendance - GBody #1 ' },
    { reason: 'Event Attendance - Review Session' },
    { reason: 'Event Attendance - Review Session' },
    { reason: 'Transfer from SP24 to New Database' },
    { reason: null },
  ];
  expect(countAttendance(rows)).toBe(2);
  expect(countAttendance([])).toBe(0);
});

test('patch only contains changed fields in database shapes', () => {
  const initial = { first_name: 'Alex', last_name: 'Rivera', major: 'CS', graduation_year: '2027', bio: '', ask_about: 'AI', linkedin_url: '', instagram_url: 'https://www.instagram.com/a' };
  const current = { ...initial, first_name: ' Alex ', graduation_year: '2028', ask_about: 'AI,  Web ,', instagram_url: '' };
  expect(buildPatch(initial, current)).toEqual({ graduation_year: 2028, ask_about: ['AI', 'Web'], instagram_url: null });
});

test('headshot helpers', () => {
  expect(headshotPathFromUrl('https://x.supabase.co/storage/v1/object/public/member-headshots/m1/a.png')).toBe('m1/a.png');
  expect(headshotPathFromUrl('https://x.supabase.co/storage/v1/object/public/headshots/old.jpg')).toBeNull();
  expect(validateHeadshot({ type: 'image/gif', size: 1 })).toMatch(/JPEG/);
  expect(validateHeadshot({ type: 'image/png', size: 6 * 1024 * 1024 })).toMatch(/5 MB/);
  expect(validateHeadshot({ type: 'image/webp', size: 1 })).toBeNull();
});

test('headshot replacement saves the path, then removes only the member\'s old image', async () => {
  const storage = { upload: jest.fn().mockResolvedValue({ error: null }), remove: jest.fn().mockResolvedValue({ error: null }) };
  supabase.storage.from.mockReturnValue(storage);
  supabase.rpc.mockResolvedValue({ data: { headshot_url: 'new' }, error: null });
  const member = { id: 'm1', headshot_url: 'https://x/storage/v1/object/public/member-headshots/m1/old.png' };
  await replaceHeadshot(member, { type: 'image/png' });
  const path = storage.upload.mock.calls[0][0];
  expect(path).toMatch(/^m1\/.+\.png$/);
  expect(supabase.rpc).toHaveBeenCalledWith('update_my_profile', { p_patch: { headshot_path: path } });
  expect(storage.remove).toHaveBeenCalledWith(['m1/old.png']);
});

test('a failed save removes the unused upload and keeps the old image', async () => {
  const storage = { upload: jest.fn().mockResolvedValue({ error: null }), remove: jest.fn().mockResolvedValue({ error: null }) };
  supabase.storage.from.mockReturnValue(storage);
  supabase.rpc.mockResolvedValue({ data: null, error: new Error('rejected') });
  await expect(replaceHeadshot({ id: 'm1', headshot_url: null }, { type: 'image/jpeg' })).rejects.toThrow('rejected');
  expect(storage.remove).toHaveBeenCalledWith([storage.upload.mock.calls[0][0]]);
});
