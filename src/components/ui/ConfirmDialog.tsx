"use client";

import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "확인",
  cancelLabel = "취소",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <p className="mb-4 text-sm text-gray-700">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
