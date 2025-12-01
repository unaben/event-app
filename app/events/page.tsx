import EventsList from "@/components/EventsList/EventsList";
import SearchFilters from "@/components/SearchFilters/SearchFilters";
import styles from './events.module.css'

export default function EventsPage() {
  return (
    <div className={styles.container}>
      <h1>Events</h1>
      <SearchFilters />
      <EventsList />
    </div>
  );
}
