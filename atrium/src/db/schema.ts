import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "@auth/core/adapters"
import { relations } from "drizzle-orm"
 
const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle"
const pool = postgres(connectionString, { max: 1 })
 
export const db = drizzle(pool)
 
export const users = pgTable("atrium_user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})
 
export const accounts = pgTable(
  "atrium_account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("atrium_session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "atrium_verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 


export const items = pgTable("atrium_items", {
  id: serial("id").primaryKey(),
  userId: text("userId")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  fileKey: text("fileKey").notNull(),
  currentBid: integer("currentBid").notNull().default(0),
  startingPrice: integer("startingPrice").notNull().default(0), //to avoid deleting tables
  bidInterval: integer("bidInterval").notNull().default(1),
  //auctionEnd: timestamp("auctionEnd", { mode: "date" }).notNull(),
});
export const bids = pgTable("a_bids", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  itemId: serial("itemId").notNull().references(() => items.id, { onDelete: "cascade" }),
  usersId: text("usersId").notNull().references(() => users.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull().defaultNow(),

});
export const usersRelations = relations(bids, ({ one }) => ({
	invitee: one(users, {
		fields: [bids.usersId],
		references: [users.id],
	}),
}));
export const schema = { bids, items, users, accounts, sessions, verificationTokens };
export type Item = typeof items.$inferSelect;