import React, { useEffect } from "react";

const useHandleEscape = (
  onCancel: () => void,
  isOpen: boolean,
  deleteBtnRef: React.RefObject<HTMLButtonElement | null>,
  openerRef: React.RefObject<HTMLElement> | undefined
) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  
  useEffect(() => {
    if (isOpen) deleteBtnRef.current?.focus();
  }, [deleteBtnRef, isOpen]);

 
  useEffect(() => {
    if (!isOpen && openerRef?.current) openerRef.current.focus();
  }, [isOpen, openerRef]);
};

export default useHandleEscape;
