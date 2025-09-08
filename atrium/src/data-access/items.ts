import { bids, items, users } from "@/db/schema";
import { database } from "@/db/database";
import { eq, desc } from "drizzle-orm";



export async function getItems(itemId : number){

      const [item] = await database
        .select()
        .from(items)
        .where(eq(items.id, itemId))
        .limit(1);
    return item;
}