"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchFilters.module.css";
import Link from "next/link";

export default function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [title, setTitle] = useState(params.get("title") ?? "");
  const [creator, setCreator] = useState(params.get("creator") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [type, setType] = useState(params.get("type") ?? "");

  const apply = () => {
    const query = new URLSearchParams();
    if (title) query.set("title", title);
    if (creator) query.set("creator", creator);
    if (location) query.set("location", location);
    if (type) query.set("type", type);
    query.set("page", "1");
    router.push(`/events?${query.toString()}`);
  };

  const clear = useCallback(() => {
    setCreator("");
    setLocation("");
    setTitle("");
    setType("");
    router.push("/events");
  }, [router]);

  return (
      <div className={styles.filters}>
        <input
          className={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Creator"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="BEERS">Beers</option>
          <option value="COCKTAILS">Cocktails</option>
          <option value="COFFEES">Coffees</option>
          <option value="MILKSHAKES">Milkshakes</option>
        </select>

        <button className={styles.button} onClick={apply}>
          Apply
        </button>
        <button className={styles.buttonSecondary} onClick={clear}>
          Clear
        </button>
        <Link href={"/events/create"} className={styles.link}>
          Create
        </Link>
      </div>
  );
}
