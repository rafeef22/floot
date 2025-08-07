import { db } from '../helpers/db';
import { schema, OutputType } from "./products_GET.schema";
import { convertDbProductToProduct } from '../helpers/convertProduct';
import superjson from "superjson";
import { URL } from "url";

export async function handle(request: Request) {
  try {
    const url = new URL(request.url, `http://${request.headers.get("host")}`);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const { priceRange, brand, size, color, quality, search } = schema.parse(queryParams);

    let query = db.
    selectFrom("products").
    selectAll().
    where("isAvailable", "=", true).
    orderBy("createdAt", "desc");

    if (priceRange) {
      switch (priceRange) {
        case "under-999":
          query = query.where("price", "<", "999");
          break;
        case "under-1499":
          query = query.where("price", "<", "1499");
          break;
        case "under-1999":
          query = query.where("price", "<", "1999");
          break;
        case "under-2499":
          query = query.where("price", "<", "2499");
          break;
        case "above-2499":
          query = query.where("price", ">", "2499");
          break;
      }
    }

    if (brand) {
      const brandMap = {
        "nike": "Nike",
        "adidas": "Adidas", 
        "puma": "Puma",
        "reebok": "Reebok",
        "yeezy": "Yeezy",
        "others": "Others"
      };
      query = query.where("brand", "=", brandMap[brand]);
    }

    if (size) {
      query = query.where("size", "=", size);
    }

    if (color) {
      const colorMap = {
        "black": "Black",
        "white": "White",
        "red": "Red",
        "blue": "Blue",
        "multicolor": "Multicolor"
      };
      query = query.where("color", "=", colorMap[color]);
    }

    if (quality) {
      const qualityMap = {
        "10a": "10A",
        "9a": "9A",
        "7a": "7A", 
        "6a": "6A",
        "5a": "5A"
      };
      query = query.where("quality", "=", qualityMap[quality]);
    }

    if (search) {
      query = query.where((eb) => 
        eb.or([
          eb("name", "ilike", `%${search}%`),
          eb("brand", "ilike", `%${search}%`)
        ])
      );
    }

    const dbProducts = await query.execute();
    const products = dbProducts.map(convertDbProductToProduct);

    return new Response(superjson.stringify({ products } satisfies OutputType), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch products", details: errorMessage }),
      { status: 400 }
    );
  }
}