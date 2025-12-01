import { IEvent } from "@/types/event.types";


const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== '') url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function fetchEvents(params?: {
  page?: number;
  pageSize?: number;
  title?: string;
  creator?: string;
  location?: string;
  type?: string;
}) {
  const url = buildUrl('/events', {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    title: params?.title,
    creator: params?.creator,
    location: params?.location,
    type: params?.type,
  });
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchEvents failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<{
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    data: IEvent[];
  }>;
}

export async function fetchEvent(id: number) {
  const res = await fetch(`${BASE}/event/${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchEvent ${id} failed: ${res.status} ${text}`);
  }
  return (res.json() as Promise<IEvent>);
}

export async function createEvent(event: Omit<IEvent, 'id'>) {
  const res = await fetch(`${BASE}/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createEvent failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<{ message?: string; data?: IEvent } | IEvent>;
}

export async function updateEvent(id: number, updates: Partial<IEvent>) {
  const res = await fetch(`${BASE}/event/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`updateEvent failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<{ message?: string; data?: IEvent } | IEvent>;
}

export async function deleteEvent(id: number) {
  const res = await fetch(`${BASE}/event/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deleteEvent failed: ${res.status} ${text}`);
  }
  return res.json();
}
