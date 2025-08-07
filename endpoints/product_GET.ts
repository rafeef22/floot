import { db } from '../helpers/db';
import { schema, OutputType } from "./product_GET.schema";
import { convertDbProductToProduct } from '../helpers/convertProduct';
import superjson from "superjson";
import { URL } from "url";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url, `http://${request.headers.get("host")}`);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const { id } = schema.parse(queryParams);

    const dbProduct = await db.
    selectFrom("products").
    selectAll().
    where("id", "=", id).
    where("isAvailable", "=", true).
    executeTakeFirst();

    if (!dbProduct) {
      return new Response(
        superjson.stringify({ error: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const product = convertDbProductToProduct(dbProduct);

    return new Response(superjson.stringify({ product } satisfies OutputType), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Failed to fetch product:`, error);
    const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch product", details: errorMessage }),
      { status: 400 }
    );
  }
}