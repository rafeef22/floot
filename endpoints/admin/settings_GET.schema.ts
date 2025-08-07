import { z } from "zod";
import superjson from "superjson";

// No input schema needed for GET
export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  settings: Record<string, string>;
};

export const getAdminSettings = async (
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/admin/settings`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = await result.json().catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(errorObject.error || "Failed to get settings");
  }
  return superjson.parse<OutputType>(await result.text());
};