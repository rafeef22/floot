import { Selectable } from "kysely";
import { Products as DbProduct, Numeric } from "./schema";
import { numericToNumber, numberToNumeric } from "./convertNumeric";

/**
 * Represents a product with numeric fields converted to `number` type for frontend use.
 * This type is what should be used across the application's components and pages.
 */
export type Product = Omit<Selectable<DbProduct>, "price" | "offerPrice"> & {
  price: number;
  offerPrice: number | null;
};

/**
 * Converts a product object from the database format (with string-based Numeric fields)
 * to the frontend-friendly format with number types for prices.
 *
 * It also ensures that camelCase naming convention is used for all properties.
 *
 * @param dbProduct The product object fetched from the database, conforming to `Selectable<Products>`.
 * @returns A `Product` object with `price` and `offerPrice` converted to numbers.
 * @throws {Error} If the base `price` is null, undefined, or not a valid number, as it's a required field.
 */
export const convertDbProductToProduct = (dbProduct: Selectable<DbProduct>): Product => {
  const price = numericToNumber(dbProduct.price as unknown as Numeric);
  if (price === null) {
    console.error("Failed to convert product: price is invalid.", { dbProduct });
    throw new Error(`Invalid product data: price is null or not a number for product ID ${dbProduct.id}.`);
  }

  const offerPrice = numericToNumber(dbProduct.offerPrice as unknown as Numeric | null);

  return {
    ...dbProduct,
    price,
    offerPrice,
  };
};

/**
 * Converts a frontend Product object back to the database format (Selectable<Products>)
 * for components that still expect the original database format.
 *
 * @param product The Product object with number-based price fields.
 * @returns A database-compatible object with string-based Numeric fields.
 */
export const productToDbFormat = (product: Product): Selectable<DbProduct> => {
  const price = numberToNumeric(product.price);
  const offerPrice = numberToNumeric(product.offerPrice);

  if (price === null) {
    throw new Error(`Invalid product data: price cannot be converted to database format for product ID ${product.id}.`);
  }

  return {
    ...product,
    price: price as string,
    offerPrice: offerPrice as string | null,
  };
};