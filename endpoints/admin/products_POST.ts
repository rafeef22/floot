import { db } from "../../helpers/db";
import { schema, OutputType } from "./products_POST.schema";
import { getServerUserSession } from "../../helpers/getServerUserSession";
import { NotAuthenticatedError } from "../../helpers/getSetServerSession";
import { convertDbProductToProduct } from "../../helpers/convertProduct";
import { Insertable } from "kysely";
import { Products } from "../../helpers/schema";
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
    const productData = schema.parse(json);

    const dbProductData: Insertable<Products> = {
      ...productData,
      price: productData.price.toString(),
      offerPrice: productData.offerPrice ? productData.offerPrice.toString() : null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newDbProduct = await db
      .insertInto("products")
      .values(dbProductData)
      .returningAll()
      .executeTakeFirstOrThrow();

    const product = convertDbProductToProduct(newDbProduct);

    return new Response(
      superjson.stringify({ product } satisfies OutputType),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to create product:", error);
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: error.message }), {
        status: 401,
      });
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to create product", details: errorMessage }),
      { status: 400 }
    );
  }
}