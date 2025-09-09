"use server";

import { auth } from "@/auth";
import { database } from "@/db/database";
import { bids, items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Knock } from "@knocklabs/node";
import { env } from "@/env";

const knock = new Knock({ apiKey: env.KNOCK_SECRET_KEY });

export async function createbidAction(itemId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to place a bid.");
  }

  const userId = session.user.id;

  const item = await database
    .select()
    .from(items)
    .where(eq(items.id, itemId))
    .then((results) => results[0]);

  if (!item) throw new Error("Item not found.");

  const newBidAmount = item.currentBid + item.bidInterval;

  // Insert new bid
  await database.insert(bids).values({
    amount: newBidAmount,
    itemId,
    usersId: userId,
    timestamp: new Date(),
  });

  // Update current bid
  await database
    .update(items)
    .set({ currentBid: newBidAmount })
    .where(eq(items.id, itemId));

  // Get all bids for this item
  const currentBids = await database
    .select()
    .from(bids)
    .where(eq(bids.itemId, itemId));

  // Collect unique recipients (excluding current user)
  const recipients: { id: string }[] = [];
  for (const bid of currentBids) {
    if (
      bid.usersId !== userId &&
      !recipients.find((r) => r.id === String(bid.usersId))
    ) {
      recipients.push({ id: String(bid.usersId) });
    }
  }

  // 🚀 Send Knock workflow (without identify)
  if (recipients.length > 0) {
    await knock.workflows.trigger("user-placed-bid", {
      actor: { id: String(userId) }, // the bidding user
      recipients, // other bidders on this item
      data: {
        itemId,
        bidAmount: newBidAmount,
        itemName: item.name,
      },
    });
  }

  revalidatePath(`/bids/${itemId}`);
}
