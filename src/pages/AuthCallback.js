import { useEffect, useState } from 'react';
import { completeGoogleSignIn, signInWithGoogle, signOut } from '../lib/auth.js';

export default function AuthCallback() {
  const [search] = useState(() => window.location.search);
  const [status, setStatus] = useState({ loading: true, error: null, unmatched: false });
  useEffect(() => {
    let active = true;
    completeGoogleSignIn(search).then(({ memberId }) => {
      if (!active) return;
      if (memberId) window.location.replace('/');
      else setStatus({ loading: false, error: null, unmatched: true });
    }).catch(error => {
      if (active) setStatus({ loading: false, error: error.message, unmatched: false });
    });
    return () => { active = false; };
  }, [search]);

  async function restart() {
    try {
      setStatus({ loading: true, error: null, unmatched: false });
      await signOut();
      await signInWithGoogle();
    } catch (error) {
      setStatus({ loading: false, error: error.message, unmatched: false });
    }
  }

  return <section className="wwa-status" aria-live="polite">
    <h1>Google sign-in</h1>
    {status.loading ? <p>Finishing sign-in…</p> : <>
      <p role={status.error ? 'alert' : undefined}>{status.error || 'You are signed in, but we could not find your URMC member record. Contact URMC for help linking your account.'}</p>
      <p><a href="mailto:urmc@cornell.edu">Contact URMC</a></p>
      <button type="button" onClick={restart}>Try Google sign-in again</button>
      <p><a href="/">Return to home</a></p>
    </>}
  </section>;
}
