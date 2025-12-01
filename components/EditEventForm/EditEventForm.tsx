"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks";
import type { IEvent } from "@/types/event.types";
import { useRouter } from "next/navigation";
import styles from "./EditEventForm.module.css";

export default function EditEventForm({ id }: { id: number }) {
  const { data: event, loading } = useApi<IEvent>(`/api/event/${id}`, {
    method: "GET",
    immediate: true,
  });

  const { execute } = useApi<IEvent, Partial<IEvent>>(`/api/event/${id}`, {
    method: "PUT",
    immediate: false,
  });

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(event?.title ?? "");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
    }
  }, [event]);

  async function handleSave() {
    if (!event) return;
    try {
      setSaving(true);
      await execute({ ...event, title });
      router.push(`/events/${id}`);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className={styles.form}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleSave} disabled={saving} className={styles.save}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
