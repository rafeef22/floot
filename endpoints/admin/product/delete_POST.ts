import { db } from "../../../helpers/db";
import { schema, OutputType } from "./delete_POST.schema";
import { getServerUserSession } from "../../../helpers/getServerUserSession";
import { NotAuthenticatedError } from "../../../helpers/getSetServerSession";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden: Admins only" }),
        { status: 403 }
      );
    }

    const json = superjson.parse(await request.text());
    const { id } = schema.parse(json);

    const result = await db
      .deleteFrom("products")
      .where("id", "=", id)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
      return new Response(
        superjson.stringify({ error: "Product not found or already deleted" }),
        { status: 404 }
      );
    }

    return new Response(
      superjson.stringify({ success: true } satisfies OutputType),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to delete product:", error);
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: error.message }), {
        status: 401,
      });
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to delete product", details: errorMessage }),
      { status: 400 }
    );
  }
}