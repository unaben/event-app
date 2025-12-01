import { NextResponse } from "next/server";
import { readEvents, writeEvents } from "../../lib/fs-events";
import type { IEvent } from "@/types/event.types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events: Array<IEvent>  = readEvents();

    const event = events?.find((e) => e.id === Number(id));

    if (!event) {
      return NextResponse.json(
        { message: `Event with id ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: `${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const events: Array<IEvent>  = readEvents();

    const index = events.findIndex((e) => e.id === Number(id));
    if (index === -1) {
      return NextResponse.json(
        { message: `Event with id ${id} not found` },
        { status: 404 }
      );
    }

    const updatedEvent = { ...events[index], ...body };
    events[index] = updatedEvent;

    writeEvents(events);

    return NextResponse.json(
      { message: "Event updated", data: updatedEvent },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: `${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events: Array<IEvent>  = readEvents();

    const exists = events.some((e) => e.id === Number(id));
    if (!exists) {
      return NextResponse.json(
        { message: `Event with id ${id} not found` },
        { status: 404 }
      );
    }

    const newEvents = events.filter((e) => e.id !== Number(id));
    writeEvents(newEvents);

    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: `${err}` },
      { status: 500 }
    );
  }
}
