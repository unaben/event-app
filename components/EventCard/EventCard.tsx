import Link from "next/link";
import styles from "./EventCard.module.css";
import { IEvent } from "@/types/event.types";
import Image from "next/image";

export default function EventCard({ event }: { event: IEvent }) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{event.title}</h3>
        <span className={styles.badge}>{event.type}</span>
      </div>

      <div className={styles.meta}>
        <div className={styles.creator}>
          <Image
            src={event.creator.avatarUrl}
            alt={event.creator.name}
            width={44}
            height={44}
            className={styles.avatar}
          />
          <div>
            <div className={styles.creatorName}>{event.creator.name}</div>
            <div className={styles.time}>
              {new Date(event.time).toLocaleString()}
            </div>
          </div>
        </div>

        <div className={styles.location}>{event.location.name}</div>
      </div>

      <div className={styles.footer}>
        <div className={styles.guests}>Guests: {event.guests.length}</div>
        <div className={styles.cta}>
          <Link href={`/events/${event.id}`} className={styles.view}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
