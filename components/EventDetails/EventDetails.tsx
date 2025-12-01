import { Dispatch, RefObject, SetStateAction } from "react";
import Link from "next/link";
import DeleteButton from "../DeleteButton/DeleteButton";
import Comments from "../Comments/Comments";
import { IEvent } from "@/types/event.types";
import Image from "next/image";
import styles from "./EventDetails.module.css";

export default function EventDetails({
  event,
  setIsOpen,
  deleteBtnRef,
}: {
  event: IEvent;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  deleteBtnRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{event.title}</h2>
        <div className={styles.actions}>
          <Link href={`/events`} className={styles.edit}>
            Back to list
          </Link>
          <Link href={`/events/${event.id}/edit`} className={styles.edit}>
            Edit
          </Link>
          <DeleteButton setIsOpen={setIsOpen} deleteBtnRef={deleteBtnRef} />
        </div>
      </div>

      <div className={styles.meta}>
        <div>
          <strong>Type:</strong> {event.type}
        </div>
        <div>
          <strong>When:</strong> {new Date(event.time).toLocaleString()}
        </div>
        <div>
          <strong>Location:</strong> {event.location.name} (
          {event.location.latitude}, {event.location.longitude})
        </div>
      </div>

      <div className={styles.section}>
        <h3>Creator</h3>
        <div className={styles.creator}>
          <Image
            width={44}
            height={44}
            src={event.creator.avatarUrl}
            alt={event.creator.name}
          />
          <div>
            <div className={styles.creatorName}>{event.creator.name}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Guests ({event.guests.length})</h3>
        <ul>
          {event.guests.map((g, i) => (
            <li key={i}>{g.name}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3>Comments</h3>
        <Comments eventId={event.id} initialComments={event.comments} />
      </div>
    </div>
  );
}
