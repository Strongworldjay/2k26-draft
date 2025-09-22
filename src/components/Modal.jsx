// src/components/Modal.jsx
import React from "react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 grid place-items-center p-4"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-neutral-900 text-white border border-white/10 shadow-xl">
        <div className="px-4 py-3 border-b border-white/10">
          <h3 id="modal-title" className="text-lg font-semibold">
            {title}
          </h3>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
