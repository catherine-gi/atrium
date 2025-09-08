import { bids, users } from "@/db/schema";
import { database } from "@/db/database";
import { eq, desc } from "drizzle-orm";



export async function getBidsForItems(itemId : number){
    const allBids = await database
    .select({
      bid: bids,
      users: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(bids)
    .leftJoin(users, eq(users.id, bids.usersId))
    .where(eq(bids.itemId, itemId))
    .orderBy(desc(bids.amount));

    return allBids;


}