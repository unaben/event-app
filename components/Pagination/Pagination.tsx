"use client";

import styles from "./Pagination.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const go = (pageNumber: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", String(pageNumber));
    router.push(`/events?${query.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.wrap}>
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className={styles.btn}
      >
        Prev
      </button>
      <div className={styles.info}>
        Page {page} of {totalPages}
      </div>
      <button
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className={styles.btn}
      >
        Next
      </button>
    </div>
  );
}