'use server'

import { auth } from "@/auth";
import { database } from "@/db/database";
import { bids, items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createbidAction(itemId : number){
    const session = await auth();
    if(!session||!session.user||!session.user.id){
        throw new Error("You must be logged in to place a bid.")
    }
    const item = await database.select()
        .from(items)
        .where(eq(items.id, itemId))
        .then(results => results[0]);
    if(!item){
        throw new Error("Item not found.")
    }
    const newBidAmount = item.currentBid + item.bidInterval;

    await database.insert(bids).values({
        amount: newBidAmount, 
        itemId,
        usersId: session.user.id,
        timestamp: new Date(),
    });

    await database.update(items).set({
        currentBid: newBidAmount,
    }).where(eq(items.id, itemId));

    revalidatePath(`/bids/${itemId}`);

}