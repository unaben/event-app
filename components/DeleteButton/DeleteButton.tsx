"use client";

import { Dispatch, RefObject, SetStateAction } from "react";
import styles from "./DeleteButton.module.css";

export default function DeleteButton({
  setIsOpen,
  deleteBtnRef,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  deleteBtnRef: RefObject<HTMLButtonElement | null>;
}) {
  const handleDelete = () => {
    setIsOpen(true);
  };

  return (
    <button ref={deleteBtnRef} className={styles.btn} onClick={handleDelete}>
      Delete
    </button>
  );
}
