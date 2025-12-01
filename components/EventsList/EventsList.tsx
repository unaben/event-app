"use client";

import { useEffect } from "react";
import { useApi } from "@/hooks";
import EventCard from "../EventCard/EventCard";
import type { IEventRes } from "@/types/event.types";
import Pagination from "../Pagination/Pagination";
import { useSearchParams } from "next/navigation";
import styles from "./EventsList.module.css";

export default function EventsList() {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "10";
  const search = searchParams.get("search") ?? "";
  const title = searchParams.get("title") ?? "";
  const type = searchParams.get("type") ?? "";

  const { data, loading, error, execute } = useApi<IEventRes>("/api/events", {
    method: "GET",
    immediate: true,
    params: {
      page,
      pageSize,
      search,
      title,
      type,
    },
  });

  useEffect(() => {
    execute();
  }, [page, pageSize, search, title, type, execute]);

  if (loading) return <p>Loading events…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data?.data.length) return <p>No events found.</p>;

  return (
    <>
      <div className={styles.grid}>
        {data.data.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Pagination page={data.page} totalPages={data.totalPages} />
      </div>
    </>
  );
}
