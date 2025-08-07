import { z } from "zod";
import superjson from "superjson";
import type { Product } from "../../../helpers/convertProduct";

export const schema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  brand: z.string().min(2, "Brand must be at least 2 characters").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  offerPrice: z.number().positive("Offer price must be a positive number").optional().nullable(),
  quality: z.string().min(3, "Quality must be at least 3 characters").optional(),
  description: z.string().optional().nullable(),
  mainImageUrl: z.string().url("Must be a valid URL").optional(),
  galleryImagesUrls: z.array(z.string().url()).optional().nullable(),
  youtubeVideoUrl: z.string().url("Must be a valid URL").optional().nullable(),
  isAvailable: z.boolean().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  product: Product;
};

export const postAdminProductUpdate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/admin/product/update`, {
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
    throw new Error(errorObject.error || "Failed to update product");
  }
  return superjson.parse<OutputType>(await result.text());
};