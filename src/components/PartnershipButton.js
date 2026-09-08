import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/partnership-dialog.css';

const EMAIL = 'urmc@cornell.edu';

export default function PartnershipButton({ className, children }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setStatus('Email address copied.');
    } catch {
      setStatus('Select and copy the email address above.');
    }
  }

  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" onClick={() => { setStatus(''); setOpen(true); }}>
        {children}
      </button>
      {open && createPortal(
        <dialog
          ref={dialogRef}
          className="partnership-dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onCancel={() => setOpen(false)}
          onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}
        >
          <div className="partnership-dialog__content">
            <button className="partnership-dialog__close" type="button" aria-label="Close partnership dialog" onClick={() => setOpen(false)}>×</button>
            <p className="partnership-dialog__eyebrow">Let’s connect</p>
            <h2 id={titleId}>Partner with URMC</h2>
            <p id={descriptionId} className="partnership-dialog__description">Help create opportunities for the next generation of computing leaders. Email us to discuss sponsorships and partnerships.</p>
            <div className="partnership-dialog__email">{EMAIL}</div>
            <div className="partnership-dialog__actions">
              <button type="button" onClick={copyEmail}>Copy email</button>
              <a href={`mailto:${EMAIL}?subject=URMC%20Partnership`}>Open email app</a>
            </div>
            <p className="partnership-dialog__status" role="status">{status || 'You can also copy the address into Gmail or your preferred email app.'}</p>
          </div>
        </dialog>, document.body
      )}
    </>
  );
}
