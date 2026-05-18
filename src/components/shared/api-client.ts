export type ApiEnvelope<T> = {
  data?: T;
  error?: string;
};

export async function fetchApi<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Request failed.");
  }

  if (payload.data === undefined) {
    throw new Error("API response did not include data.");
  }

  return payload.data;
}
