// src/components/Modal.jsx
import React, { useEffect } from 'react';

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 grid place-items-center p-4"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-sm rounded-xl bg-[#f3e8d2] text-black border border-black/12 shadow-xl">
        <div className="px-4 py-3 border-b border-black/10">
          <h3 id="modal-title" className="text-lg font-semibold">
            {title}
          </h3>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
