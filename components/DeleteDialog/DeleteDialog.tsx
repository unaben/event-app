import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { createPortal } from "react-dom";
import { useFocusTrap, usePreventBackgroundInteraction } from "@/hooks";
import type { DeleteDialogProps } from "./DeleteDialog.types";
import styles from "./DeleteDialog.module.css";

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  itemId,
  onConfirm,
  onCancel,
  openerRef,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleCancel = () => {
    onCancel();
    setConfirmText("");
  };

  useFocusTrap(dialogRef, isOpen);
  usePreventBackgroundInteraction(isOpen);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) deleteBtnRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && openerRef?.current) openerRef.current.focus();
  }, [isOpen, openerRef]);

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node))
      onCancel();
  };

  const portalRoot = document.getElementById("dialog-root") || document.body;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div
        ref={dialogRef}
        className={cn(styles.dialog, styles.dialogOpen)}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className={styles.title}>
          Confirm Delete
        </h2>
        <p id="dialog-message" className={styles.message}>
          Are you sure you want to delete item with ID: {itemId}?
        </p>
        <input
          type="text"
          className={styles.confirmInput}
          placeholder="Type CONFIRM to delete"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button
            ref={deleteBtnRef}
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={!confirmText.toUpperCase().includes("CONFIRM")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default DeleteDialog;
