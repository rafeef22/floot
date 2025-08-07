import { Numeric } from "./schema";

/**
 * Converts a Kysely Numeric type (string) to a JavaScript number.
 * Handles null and undefined values gracefully.
 * @param numeric The Numeric string to convert.
 * @returns A number, or null if the input is null, undefined, or not a valid number.
 */
export const numericToNumber = (numeric: Numeric | null | undefined): number | null => {
  if (numeric === null || numeric === undefined) {
    return null;
  }
  // Kysely's Numeric type for PostgreSQL is already a string.
  const num = parseFloat(numeric as unknown as string);
  return isNaN(num) ? null : num;
};

/**
 * Converts a JavaScript number to a Kysely Numeric type (string).
 * Handles null and undefined values gracefully.
 * @param num The number to convert.
 * @returns A string representation of the number, or null if the input is null or undefined.
 */
export const numberToNumeric = (num: number | null | undefined): string | null => {
  if (num === null || num === undefined) {
    return null;
  }
  return num.toString();
};