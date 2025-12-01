"use client";

import { Suspense } from "react";
import EventsList from "@/components/EventsList/EventsList";
import SearchFilters from "@/components/SearchFilters/SearchFilters";
import styles from "./events.module.css";

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.container}>
        <h1>Events</h1>
        <SearchFilters />
        <EventsList />
      </div>
    </Suspense>
  );
}
