import { z } from "zod";
import superjson from "superjson";
import type { Product } from '../helpers/convertProduct';

export const schema = z.object({
  id: z.coerce.number().int().positive()
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  product: Product;
};

export const getProduct = async (
params: InputType,
init?: RequestInit)
: Promise<OutputType> => {
  const searchParams = new URLSearchParams({ id: params.id.toString() });

  const result = await fetch(`/_api/product?${searchParams.toString()}`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!result.ok) {
    const errorObject = await result.json().catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(errorObject.error || "Failed to fetch product");
  }
  return superjson.parse<OutputType>(await result.text());
};