"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks";
import EventDetails from "@/components/EventDetails/EventDetails";
import type { IEvent } from "@/types/event.types";
import DeleteDialog from "@/components/DeleteDialog/DeleteDialog";

export default function EventDetailsClient({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const deleteBtnRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  console.log({ isOpen });

  const { data: event, loading } = useApi<IEvent>(`/api/event/${Number(id)}`, {
    method: "GET",
    immediate: true,
  });

  const { execute: deleteEvent } = useApi<null>(
    `/api/event/${id}`,
    { method: "DELETE" }
  );

  const handleDelete = async () => {
    try {
      await deleteEvent(id);
      router.push("/events");
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  if (!event) {
    return <p>Event not found or failed to load.</p>;
  }

  if (loading) {
    return <p>Loading....</p>;
  }

  return (
    <>
      <EventDetails
        event={event}
        setIsOpen={setIsOpen}
        deleteBtnRef={deleteBtnRef}
      />
      <DeleteDialog
        isOpen={isOpen}
        itemId={event.id}
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
        openerRef={deleteBtnRef as React.RefObject<HTMLElement>}
      />
    </>
  );
}
