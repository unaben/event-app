"use client";

import { useState } from "react";
import type { IEvent, IEventComment } from "@/types/event.types";
import { useApi } from "@/hooks";
import styles from "./Comments.module.css";

export default function Comments({
  eventId,
  initialComments,
}: {
  eventId: number;
  initialComments: IEventComment[];
}) {
  const [comments, setComments] = useState<IEventComment[]>(
    initialComments || []
  );
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  const { data: event } = useApi<IEvent>(`/api/event/${eventId}`, {
    method: "GET",
    immediate: true,
  });

  const { execute, loading } = useApi<IEvent, Partial<IEvent>>(
    `/api/event/${eventId}`,
    { method: "PUT", immediate: false }
  );

  const postComment = async () => {
    if (!message.trim()) return;
    setPosting(true);
    try {
      const newComment: IEventComment = {
        user: { name: "Anonymous", avatarUrl: "" },
        timestamp: new Date().toISOString(),
        message: message.trim(),
      };

      const updated = {
        ...event,
        comments: [...(event?.comments || []), newComment],
      };
      await execute(updated);
      setComments((prev) => [...prev, newComment]);
      setMessage("");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.box}>
      <ul className={styles.list}>
        {comments.map((c, i) => (
          <li key={i} className={styles.item}>
            <div className={styles.meta}>
              <strong>{c.user?.name ?? "Unknown"}</strong>
              <span className={styles.time}>
                {new Date(c.timestamp).toLocaleString()}
              </span>
            </div>
            <div>{c.message}</div>
          </li>
        ))}
      </ul>

      <form onSubmit={postComment} className={styles.form}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a comment..."
        />
        <button disabled={posting}>{posting ? "Posting..." : "Post"}</button>
      </form>
    </div>
  );
}
