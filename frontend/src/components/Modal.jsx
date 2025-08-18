import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick = () => {},
  closeOnBackdrop = true,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm z-50"
      onClick={() => {
        if (closeOnBackdrop) onClose();
      }}
      aria-hidden={!isOpen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Modal"}
        tabIndex={-1}
        ref={containerRef}
        className="relative flex flex-col bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-violet-100 max-w-[95vw] max-h-[95vh]"
        onClick={(e) => e.stopPropagation()} // prevent backdrop click when interacting inside
      >
        {!hideHeader && (
          <div className="flex items-center justify-between p-6 border-b border-violet-100 bg-gradient-to-r from-white to-violet-50">
            <h3 className="text-xl font-black text-slate-900">{title}</h3>

            <div className="flex items-center gap-3 ">
              {showActionBtn && (
                <button
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg mr-12"
                  onClick={onActionClick}
                >
                  {actionBtnIcon}
                  {actionBtnText}
                </button>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          className="absolute top-6 right-4 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-lg hover:scale-110 z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
