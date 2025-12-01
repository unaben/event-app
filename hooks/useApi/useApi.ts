"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseApiOptions, ApiState } from "./useApi.types";

export default function useApi<TResponse = unknown, TBody = unknown>(
  url: string,
  options: UseApiOptions<TBody> = {}
) {
  const { 
    method = "GET", 
    body, 
    immediate = false, 
    params, 
    headers,
    credentials = "include", 
    authorize = true, 
  } = options;

  const [state, setState] = useState<ApiState<TResponse>>({
    data: null,
    error: null,
    loading: false,
  });

  const controllerRef = useRef<AbortController | null>(null);
  
 
  const optionsRef = useRef({ method, body, params, headers, credentials, authorize });
  
  useEffect(() => {
    optionsRef.current = { method, body, params, headers, credentials, authorize };
  }, [method, body, params, headers, credentials, authorize]);

  const execute = useCallback(
    async (overrideBody?: TBody) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        controllerRef.current?.abort();
        controllerRef.current = new AbortController();

        const { 
          params: currentParams, 
          headers: currentHeaders, 
          body: currentBody, 
          method: currentMethod,
          credentials: currentCredentials,
          authorize: currentAuthorize,
        } = optionsRef.current;

        const qs = currentParams
          ? "?" +
            Object.entries(currentParams)
              .filter(([_, v]) => v !== undefined)
              .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
              .join("&")
          : "";

       
        const fetchHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          ...(currentHeaders || {}),
        };

       
        if (currentAuthorize) {
          const token = typeof window !== 'undefined' 
            ? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
            : null;
          
          if (token) {
            fetchHeaders.Authorization = `Bearer ${token}`;
          }
        }

        const res = await fetch(url + qs, {
          method: currentMethod,
          headers: fetchHeaders,
          credentials: currentCredentials,
          body: overrideBody
            ? JSON.stringify(overrideBody)
            : currentBody
            ? JSON.stringify(currentBody)
            : undefined,
          signal: controllerRef.current.signal,
        });

        const json = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_token');
              sessionStorage.removeItem('auth_token');
            }
            throw new Error('Unauthorized - Please log in again');
          }
          
          throw new Error(json?.message || "Request failed");
        }

        setState({ data: json, error: null, loading: false });
        return json;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        setState({
          data: null,
          error: err instanceof Error ? err.message : "Unknown error",
          loading: false,
        });
      }
    },
    [url]
  );

  useEffect(() => {
    if (immediate) execute();
    return () => controllerRef.current?.abort();
  }, [execute, immediate]);

  return { ...state, execute };
}