import { database } from "@/db/database";
import { items } from "@/db/schema";
import { auth } from "@/auth";
import { ItemCard } from "@/app/item-card";
import { eq } from "drizzle-orm";
import { EmptyState } from "./empty-state";

export default async function MyAuctionPage() {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  if (!session.user || !session.user.id) {
    throw new Error("No user found");
  }

  const allItems = await database
    .select()
    .from(items)
    .where(eq(items.userId, session.user.id));  

  const hasItems = allItems.length > 0;

  return (
<main className="container mx-auto py-12">
  <h1 className="text-4xl font-extrabold mb-10 text-center">
    My Items for Sale
  </h1>

  {hasItems ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {allItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  ) : (
    <div className="flex justify-center items-center py-20">
      <EmptyState />
    </div>
  )}
</main>

  );
}
