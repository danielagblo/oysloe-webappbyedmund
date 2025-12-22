import React, { useLayoutEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  message: string;
  setMessage: (s: string) => void;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
};

const ReportModal: React.FC<Props> = ({
  isOpen,
  message,
  setMessage,
  onClose,
  onSubmit,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg text-left w-[95%] max-w-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Report ad"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Report Ad</h3>
            <p className="text-sm text-gray-600 mb-3">
              Describe the issue so our team can review it.
            </p>
          </div>
          <button
            aria-label="Close report modal"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full p-3 border border-gray-200 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
          rows={6}
          placeholder="Enter details about the issue..."
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded text-sm hover:scale-95 transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await onSubmit();
            }}
            className="px-4 py-2 bg-(--div-active) text-(--dark-def) rounded text-sm hover:scale-95 transition"
          >
            Send Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
