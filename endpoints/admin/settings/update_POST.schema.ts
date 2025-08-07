import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  settings: z.record(z.string(), z.string()),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  success: boolean;
};

export const postAdminSettingsUpdate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/admin/settings/update`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    const errorObject = await result.json().catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(errorObject.error || "Failed to update settings");
  }
  return superjson.parse<OutputType>(await result.text());
};