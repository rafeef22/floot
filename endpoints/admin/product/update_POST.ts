import { db } from "../../../helpers/db";
import { schema, OutputType } from "./update_POST.schema";
import { getServerUserSession } from "../../../helpers/getServerUserSession";
import { NotAuthenticatedError } from "../../../helpers/getSetServerSession";
import { convertDbProductToProduct } from "../../../helpers/convertProduct";
import { Updateable } from "kysely";
import { Products } from "../../../helpers/schema";
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
    const { id, ...updateData } = schema.parse(json);

    const dbUpdateData: Updateable<Products> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Convert number fields to string for database
    if (updateData.price !== undefined) {
      dbUpdateData.price = updateData.price.toString();
    }
    if (updateData.offerPrice !== undefined) {
      dbUpdateData.offerPrice = updateData.offerPrice ? updateData.offerPrice.toString() : null;
    }

    const updatedDbProduct = await db
      .updateTable("products")
      .set(dbUpdateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (!updatedDbProduct) {
      return new Response(
        superjson.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    const product = convertDbProductToProduct(updatedDbProduct);

    return new Response(
      superjson.stringify({ product } satisfies OutputType),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to update product:", error);
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: error.message }), {
        status: 401,
      });
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to update product", details: errorMessage }),
      { status: 400 }
    );
  }
}