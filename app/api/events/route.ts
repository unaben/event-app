import { NextResponse } from "next/server";
import { readEvents } from "@/app/api/lib/fs-events";
import { IEvent } from "@/types/event.types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);

    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { message: "Invalid pagination values." },
        { status: 400 }
      );
    }

    const filterLocation = searchParams.get("location")?.toLowerCase() || null;
    const filterType = searchParams.get("type") || null;
    const filterTitle = searchParams.get("title")?.toLowerCase() || null;
    const filterCreator = searchParams.get("creator")?.toLowerCase() || null;

    const eventsData = await readEvents();

    const events = Array.isArray(eventsData)
      ? eventsData
      : (eventsData as { events: Array<IEvent> })?.events || [];

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { message: "No events available.", data: [] },
        { status: 200 }
      );
    }

    let filteredEvent = [...events];

    if (filterLocation) {
      filteredEvent = filteredEvent.filter((event) =>
        event?.location?.name?.toLowerCase().includes(filterLocation)
      );
    }

    if (filterType) {
      filteredEvent = filteredEvent.filter(
        (event) => event?.type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (filterTitle) {
      filteredEvent = filteredEvent.filter((event) =>
        event?.title?.toLowerCase().includes(filterTitle)
      );
    }

    if (filterCreator) {
      filteredEvent = filteredEvent.filter((event) =>
        event?.creator?.name?.toLowerCase().includes(filterCreator)
      );
    }

    if (filteredEvent.length === 0) {
      return NextResponse.json(
        {
          message: "No events matched your filter criteria.",
          filters: {
            location: filterLocation,
            type: filterType,
            title: filterTitle,
            creator: filterCreator,
          },
          data: [],
        },
        { status: 404 }
      );
    }

    const total = filteredEvent.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filteredEvent.slice(start, end);

    return NextResponse.json(
      {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        data: paginated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        message: "Server error.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
