import { NextResponse } from 'next/server';
import { readEvents, writeEvents } from '../lib/fs-events';
import type { IEvent } from '@/types/event.types';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.time || !body.location || !body.creator) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const events: Array<IEvent>  = readEvents();
    const newEvent = {
      id: events.length ? Math.max(...events.map(e => e.id)) + 1 : 1,
      ...body,
    };

    events.push(newEvent);
    writeEvents(events);

    return NextResponse.json(
      { message: "Event created", data: newEvent },
      { status: 201 }
    );

  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: `${err}` },
      { status: 500 }
    );
  }
}
