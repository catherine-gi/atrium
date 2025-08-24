import { pgTable,serial}from "drizzle-orm/pg-core";
export const bids = pgTable("a_bids", {
  id: serial("id").primaryKey()}
);