import { z } from "zod";
import superjson from "superjson";
import type { Product } from '../helpers/convertProduct';

export const PriceRangeSchema = z.enum([
"under-999",
"under-1499",
"under-1999",
"under-2499",
"above-2499"]
);
export type PriceRange = z.infer<typeof PriceRangeSchema>;

export const BrandSchema = z.enum([
"nike",
"adidas", 
"puma",
"reebok",
"yeezy",
"others"
]);
export type Brand = z.infer<typeof BrandSchema>;

export const SizeSchema = z.enum([
"10A",
"7A",
"6A",
"5A",
"9A"
]);
export type Size = z.infer<typeof SizeSchema>;

export const ColorSchema = z.enum([
"black",
"white",
"red",
"blue",
"multicolor"
]);
export type Color = z.infer<typeof ColorSchema>;

export const QualitySchema = z.enum([
"10a",
"9a", 
"7a",
"6a",
"5a"
]);
export type Quality = z.infer<typeof QualitySchema>;

export const schema = z.object({
  priceRange: PriceRangeSchema.optional(),
  brand: BrandSchema.optional(),
  size: SizeSchema.optional(),
  color: ColorSchema.optional(),
  quality: QualitySchema.optional(),
  search: z.string().optional()
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  products: Product[];
};

export const getProducts = async (
params?: InputType,
init?: RequestInit)
: Promise<OutputType> => {
  const searchParams = new URLSearchParams();
  if (params?.priceRange) {
    searchParams.set("priceRange", params.priceRange);
  }
  if (params?.brand) {
    searchParams.set("brand", params.brand);
  }
  if (params?.size) {
    searchParams.set("size", params.size);
  }
  if (params?.color) {
    searchParams.set("color", params.color);
  }
  if (params?.quality) {
    searchParams.set("quality", params.quality);
  }
  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const result = await fetch(`/_api/products?${searchParams.toString()}`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!result.ok) {
    const errorObject = await result.json().catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(errorObject.error || "Failed to fetch products");
  }
  return superjson.parse<OutputType>(await result.text());
};