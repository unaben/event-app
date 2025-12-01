"use client";

import { useState } from "react";
import styles from "./CreateEventForm.module.css";
import { useRouter } from "next/navigation";
import { IEvent } from "@/types/event.types";
import { useApi } from "@/hooks";

type IType = "BEERS" | "COCKTAILS" | "COFFEES" | "MILKSHAKES"

export default function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<IType>("BEERS");
  const [creatorName, setCreatorName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { execute, loading, error } = useApi<IEvent, Partial<IEvent>>(
    "/api/event",
    { method: "POST" }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !creatorName) {
      alert("Enter title and creator name");
      return;
    }
    setSubmitting(true);
    const now = new Date().toISOString();
    try {
      await execute({
        time: now,
        title,
        type,
        creator: { name: creatorName, avatarUrl: "" },
        guests: [],
        location: { name: "Unknown", latitude: 0, longitude: 0 },
        comments: [],
      });
      router.push("/events");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label>
        Creator name
        <input
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
        />
      </label>

      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value as IType)}>
          <option value="BEERS">Beers</option>
          <option value="COCKTAILS">Cocktails</option>
          <option value="COFFEES">Coffees</option>
          <option value="MILKSHAKES">Milkshakes</option>
        </select>
      </label>

      <div style={{ marginTop: 12 }}>
        <button disabled={submitting} className={styles.create}>
          {submitting ? "Creating…" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
