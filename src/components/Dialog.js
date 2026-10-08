import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Dialog({ children, onClose, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    dialog.querySelector('[data-dialog-close]')?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return createPortal(
    <dialog
      {...props}
      ref={ref}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      {children}
    </dialog>,
    document.body
  );
}
