import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for session authentication
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  // Handle non-2xx responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error ${response.status}`);
  }

  // Check if the response has content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      queryFn: async ({ queryKey }) => {
        // Handle array queryKeys by joining them with /
        const url = Array.isArray(queryKey) ? queryKey.join("/") : queryKey.toString();
        
        // If the URL already contains http, use it as is, otherwise prepend with /api
        const fullUrl = url.startsWith("http") ? url : url.startsWith("/") ? url : `/${url}`;
        
        return apiRequest(fullUrl);
      },
    },
  },
});