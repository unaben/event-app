import { IEvent } from '@/types/event.types';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app', 'api', 'events.json');

export function readEvents() {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    throw new Error("Failed to read events.json");
  }
}

export function writeEvents(events: Array<IEvent>): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
  } catch {
    throw new Error("Failed to write events.json");
  }
}

