This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

| Endpoint         | Success | Errors              |
| ---------------- | ------- | ------------------- |
| GET /events      | `200`   | `400`, `404`, `500` |
| GET /event/id    | `200`   | `404`, `500`        |
| POST /event      | `201`   | `400`, `500`        |
| PUT /event/id    | `200`   | `400`, `404`, `500` |
| DELETE /event/id | `200`   | `404`, `500`        |

# useApi Hook Documentation

A custom React hook for making API requests with built-in state management, automatic abort on unmount, and TypeScript support.

## Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)

## Installation

The hook is already included in your project at `/hooks/useApi`.

## Basic Usage

### GET Request (Immediate)

```typescript
import { useApi } from "@/hooks/useApi";

function UserProfile() {
  const { data, loading, error } = useApi("/api/user/123", {
    immediate: true, // Fetch on mount
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>{data?.name}</div>;
}
```

### GET Request (Manual)

```typescript
function SearchUsers() {
  const { data, loading, execute } = useApi("/api/users", {
    immediate: false, // Don't fetch on mount
  });

  const handleSearch = async () => {
    await execute();
  };

  return (
    <div>
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Loading...</p>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```

## API Reference

### Hook Signature

```typescript
useApi<TResponse, TBody>(url: string, options?: UseApiOptions<TBody>)
```

### Type Parameters

- `TResponse` - Type of the response data (default: `unknown`)
- `TBody` - Type of the request body (default: `unknown`)

### Options

```typescript
interface UseApiOptions<TBody> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; // Default: "GET"
  body?: TBody;                                          // Request body
  immediate?: boolean;                                   // Auto-execute on mount (default: false)
  params?: Record<string, string | number | undefined>;  // URL query parameters
  headers?: Record<string, string>;                      // Additional headers
}
```

### Return Value

```typescript
interface ApiState<TResponse> {
  data: TResponse | null;     // Response data
  error: string | null;       // Error message
  loading: boolean;           // Loading state
  execute: (overrideBody?: TBody) => Promise<TResponse | undefined>;
}
```

## Examples

### 1. GET with Query Parameters

```typescript
function EventsList() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const type = searchParams.get('type') ?? '';

  const { data, loading, error } = useApi<IEventResponse>("/api/events", {
    method: "GET",
    immediate: true,
    params: {
      page,
      pageSize: 10,
      type,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data?.data.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### 2. POST Request (Create)

```typescript
interface CreateEventBody {
  title: string;
  location: string;
  type: string;
}

function CreateEvent() {
  const { execute, loading, error } = useApi<IEvent, CreateEventBody>(
    "/api/events",
    {
      method: "POST",
      immediate: false,
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await execute({
      title: formData.get("title") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
    });

    if (result) {
      alert("Event created!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <input name="location" placeholder="Location" required />
      <select name="type">
        <option value="BEERS">Beers</option>
        <option value="COFFEES">Coffees</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### 3. PUT Request (Update)

```typescript
function EditEvent({ eventId }: { eventId: number }) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
  });

  const { execute, loading } = useApi<IEvent, Partial<IEvent>>(
    `/api/events/${eventId}`,
    {
      method: "PUT",
      immediate: false,
    }
  );

  const handleUpdate = async () => {
    const result = await execute(formData);
    if (result) {
      alert("Event updated!");
    }
  };

  return (
    <div>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      />
      <button onClick={handleUpdate} disabled={loading}>
        Update
      </button>
    </div>
  );
}
```

### 4. DELETE Request

```typescript
function DeleteEvent({ eventId }: { eventId: number }) {
  const { execute, loading } = useApi(`/api/events/${eventId}`, {
    method: "DELETE",
    immediate: false,
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    const result = await execute();
    if (result) {
      alert("Event deleted!");
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### 5. Re-fetching on Dependency Change

```typescript
function UserPosts({ userId }: { userId: number }) {
  const { data, loading, execute } = useApi<IPost[]>(
    `/api/users/${userId}/posts`,
    {
      immediate: true,
    }
  );

  // Re-fetch when userId changes
  useEffect(() => {
    execute();
  }, [userId, execute]);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      {data?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 6. Pagination with useApi

```typescript
function PaginatedList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const { data, loading, execute } = useApi<IPaginatedResponse>(
    "/api/items",
    {
      method: "GET",
      immediate: true,
      params: { page, pageSize: 10 },
    }
  );

  // Re-fetch when page changes
  useEffect(() => {
    execute();
  }, [page, execute]);

  return (
    <div>
      {data?.data.map(item => <div key={item.id}>{item.name}</div>)}
      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
      />
    </div>
  );
}
```

### 7. Custom Headers (Authentication)

```typescript
function ProtectedData() {
  const token = useAuthToken(); // Your auth hook

  const { data, loading } = useApi("/api/protected", {
    immediate: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Custom-Header": "value",
    },
  });

  return <div>{data?.message}</div>;
}
```

### 8. Authorization with Session/Cookies

```typescript
function AuthenticatedRequest() {
  const { data, loading } = useApi("/api/user/profile", {
    immediate: true,
    // Credentials included automatically sends cookies
    credentials: "include",
  });

  return <div>{data?.email}</div>;
}
```

## Advanced Usage

### Conditional Fetching

```typescript
function ConditionalFetch({ shouldFetch }: { shouldFetch: boolean }) {
  const { data, execute } = useApi("/api/data", {
    immediate: false,
  });

  useEffect(() => {
    if (shouldFetch) {
      execute();
    }
  }, [shouldFetch, execute]);

  return <div>{data?.content}</div>;
}
```

### Sequential Requests

```typescript
function SequentialRequests() {
  const createEvent = useApi<IEvent, CreateEventBody>("/api/events", {
    method: "POST",
    immediate: false,
  });

  const fetchEvents = useApi<IEvent[]>("/api/events", {
    method: "GET",
    immediate: false,
  });

  const handleCreate = async () => {
    // First create
    const newEvent = await createEvent.execute({
      title: "New Event",
      location: "Paris",
      type: "BEERS",
    });

    // Then refresh list
    if (newEvent) {
      await fetchEvents.execute();
    }
  };

  return (
    <div>
      <button onClick={handleCreate}>Create & Refresh</button>
      {fetchEvents.data?.map(e => <div key={e.id}>{e.title}</div>)}
    </div>
  );
}
```

### Form with Optimistic Updates

```typescript
function OptimisticUpdate({ eventId }: { eventId: number }) {
  const [localData, setLocalData] = useState<IEvent | null>(null);

  const { execute, loading } = useApi<IEvent, Partial<IEvent>>(
    `/api/events/${eventId}`,
    {
      method: "PUT",
      immediate: false,
    }
  );

  const handleUpdate = async (updates: Partial<IEvent>) => {
    // Optimistic update
    setLocalData(prev => prev ? { ...prev, ...updates } : null);

    try {
      const result = await execute(updates);
      if (result) {
        setLocalData(result); // Use server response
      }
    } catch {
      // Revert on error
      // You'd need to store the original data
    }
  };

  return <div>{localData?.title}</div>;
}
```

## Best Practices

### 1. Always Type Your Responses

```typescript
// Good ✅
const { data } = useApi<IUser>("/api/user");

// Bad ❌
const { data } = useApi("/api/user");
```

### 2. Use `immediate: false` for Mutations

```typescript
// Good ✅
const { execute } = useApi("/api/events", {
  method: "POST",
  immediate: false, // Don't POST on mount
});

// Bad ❌
const { execute } = useApi("/api/events", {
  method: "POST",
  immediate: true, // This will POST immediately!
});
```

### 3. Handle Loading and Error States

```typescript
// Good ✅
if (loading) return <Spinner />;
if (error) return <ErrorMessage message={error} />;
if (!data) return null;

// Bad ❌
return <div>{data.name}</div>; // Can crash if data is null
```

### 4. Use useEffect for Re-fetching

```typescript
// Good ✅
useEffect(() => {
  execute();
}, [userId, execute]);

// Bad ❌
// Not re-fetching when dependencies change
```

### 5. Cancel Requests on Unmount

The hook automatically cancels requests when the component unmounts, so you don't need to worry about memory leaks.

### 6. Avoid Inline Objects in Options

```typescript
// Good ✅
const params = useMemo(() => ({ page, type }), [page, type]);
const { data } = useApi("/api/events", { params });

// Bad ❌ (causes infinite re-renders)
const { data } = useApi("/api/events", {
  params: { page, type }, // New object every render
});
```

## Limitations

1. **No localStorage/sessionStorage** - The hook doesn't persist data between sessions
2. **Single request at a time** - Previous requests are cancelled when a new one starts
3. **No caching** - Each execute() makes a fresh request
4. **JSON only** - Automatically sets `Content-Type: application/json`

## Troubleshooting

### Infinite Loop

**Problem:** Component keeps re-rendering infinitely

**Solution:** Make sure dependencies in `useEffect` are stable:

```typescript
// Use useMemo for object/array dependencies
const params = useMemo(() => ({ page, type }), [page, type]);
```

### Request Not Updating

**Problem:** Data doesn't update when dependencies change

**Solution:** Add `useEffect` to call `execute()`:

```typescript
useEffect(() => {
  execute();
}, [userId, execute]);
```

### TypeScript Errors

**Problem:** Type errors with response data

**Solution:** Explicitly type the hook:

```typescript
interface MyResponse {
  data: IEvent[];
  total: number;
}

const { data } = useApi<MyResponse>("/api/events");
```

## Support

For issues or questions, please contact the development team or check the source code at `/hooks/useApi`.