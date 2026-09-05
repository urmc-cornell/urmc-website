import { useEffect, useRef } from 'react';
import instagramIcon from '../images/events/instagram.svg';
import closeIcon from '../images/events/close.svg';

export default function FeaturedEventDialog({ event, onClose, instagramUrl }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    closeButtonRef.current.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog ref={dialogRef} className="featured-event-dialog" aria-labelledby="featured-event-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="featured-event-detail">
        <img className="featured-event-full-flyer" src={event.image} alt={`${event.title} flyer`} />
        <div className="featured-event-detail-copy">
          <h2 id="featured-event-title">{event.title}</h2>
          {event.details && <p>{event.details}</p>}
          {event.tags && <div className="featured-event-tags">{event.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
          {event.description && <p className="featured-event-description">{event.description}</p>}
          <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Visit URMC on Instagram"><img src={instagramIcon} alt="" /></a>
        </div>
        <button ref={closeButtonRef} type="button" className="featured-event-close" onClick={onClose} aria-label="Close event details">
          <img src={closeIcon} alt="" />
        </button>
      </div>
    </dialog>
  );
}
