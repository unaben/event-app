import { NextResponse } from 'next/server';
import { readEvents } from '@/app/api/lib/fs-events';

export async function GET() {
  try {
    const events = await readEvents();

    return NextResponse.json({
      status: 'ok',
      message: 'API is healthy',
      eventCount: events.length,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to read event storage',
      error: String(err)
    }, { status: 500 });
  }
}
