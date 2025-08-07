import { db } from "../../../helpers/db";
import { schema, OutputType } from "./update_POST.schema";
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
    const { settings } = schema.parse(json);

    await db.transaction().execute(async (trx) => {
      for (const [key, value] of Object.entries(settings)) {
        await trx
          .insertInto("settings")
          .values({ key, value, updatedAt: new Date() })
          .onConflict((oc) =>
            oc.column("key").doUpdateSet({ value, updatedAt: new Date() })
          )
          .execute();
      }
    });

    return new Response(
      superjson.stringify({ success: true } satisfies OutputType),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to update settings:", error);
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: error.message }), {
        status: 401,
      });
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to update settings", details: errorMessage }),
      { status: 400 }
    );
  }
}