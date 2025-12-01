export interface UseApiOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  immediate?: boolean;
  params?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  authorize?: boolean;
}

export interface ApiState<TResponse = unknown> {
  data: TResponse | null;
  error: string | null;
  loading: boolean;
}

export interface ApiReturn<TResponse = unknown> extends ApiState<TResponse> {
  execute: (overrideBody?: unknown) => Promise<TResponse | undefined>;
}