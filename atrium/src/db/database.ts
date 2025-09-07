import { env } from "../env";
//import * as schema from "./schema"
import { schema } from "./schema";

import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var database: ReturnType<typeof drizzle> | undefined;
}

let database: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === "production") {
  const pg = postgres(env.DATABASE_URL);
  database = drizzle(pg, { schema });
} else {
  if (!globalThis.database) {
    const pg = postgres(env.DATABASE_URL);
    globalThis.database = drizzle(pg, { schema });
  }
  database = globalThis.database;
}

export { database };


// declare global {
//   // eslint-disable-next-line no-var -- only var works here
//   var database: PostgresJsDatabase<typeof schema> | undefined;
// }

// let database: PostgresJsDatabase<typeof schema>;
// let pg: ReturnType<typeof postgres>;

// if (env.NODE_ENV === "production") {
//   pg = postgres(env.DATABASE_URL);
//   database = drizzle(pg, { schema });
// } else {
//   if (!global.database) {
//     pg = postgres(env.DATABASE_URL);
//     global.database = drizzle(pg, { schema });
//   }
//   database = global.database;
// }

// export { database, pg };