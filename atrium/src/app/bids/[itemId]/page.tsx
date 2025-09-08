import { database } from "@/db/database";
import { bids, items, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getImgUrl } from "@/util/files";
import { formatDistance } from "date-fns";
import { createbidAction } from "./actions";
import { auth } from "@/auth";
import { getBidsForItems } from "@/data-access/bids";
import { getItems } from "@/data-access/items";

function formatTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), { addSuffix: true });
}

export default async function ItemPage({
  params,
}: {
  params: { itemId: string };
}) {
  const id = parseInt(params.itemId, 10);

  const session = await auth();
  const user = session?.user;

  // const [item] = await database
  //   .select()
  //   .from(items)
  //   .where(eq(items.id, id))
  //   .limit(1);
  const item = await getItems(id);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <Image
          src="/undraw_no-data_ig65.svg"
          alt="Item not found"
          width={300}
          height={300}
          className="opacity-80"
        />
        <h1 className="text-3xl font-semibold text-gray-800">Item not found</h1>
        <Button variant="link" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
      </div>
    );
  }

  //  fetch bids ordered by highest first
  // const allBids = await database
  //   .select({
  //     bid: bids,
  //     users: {
  //       id: users.id,
  //       name: users.name,
  //       image: users.image,
  //     },
  //   })
  //   .from(bids)
  //   .leftJoin(users, eq(users.id, bids.usersId))
  //   .where(eq(bids.itemId, id))
  //   .orderBy(desc(bids.amount));
  const allBids = await getBidsForItems(item.id);

  const hasBids = allBids.length > 0;

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left side: Item details */}
        <div className="space-y-6 sticky top-12 self-start">
          <h1 className="text-3xl font-bold text-gray-900">
            Auction for {item.name}
          </h1>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border">
            <Image
              src={getImgUrl(item.fileKey)}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          <div className="space-y-2 text-lg text-gray-700">
            <div>
              Bid Interval:{" "}
              <span className="font-semibold text-gray-900">
                ${item.bidInterval}
              </span>
            </div>
            <div>
              Starting Price:{" "}
              <span className="font-semibold text-2xl text-gray-900">
                ${item.startingPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Scrollable Bids */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Current Bids</h2>

          {/* Place Bid button */}
          {user ? (
            <form action={createbidAction.bind(null, item.id)} className="pt-2">
              <Button className="w-full">Place a Bid</Button>
            </form>
          ) : (
            <div className="pt-2">
              <Button className="w-full" disabled>
                Place a Bid
              </Button>
              <p className="text-red-500 text-sm text-center mt-2">
                You must be logged in to place a bid.
              </p>
            </div>
          )}

          {/* Scrollable Bids List */}
          <div className="max-h-96 overflow-y-auto pr-2 border rounded-lg bg-gray-50">
            {!hasBids ? (
              <p className="text-gray-500 italic p-4">No bids yet. Be the first!</p>
            ) : (
              <ul className="space-y-3 p-4">
                {allBids.map((bid, index) => (
                  <li
                    key={bid.bid.id}
                    className={`p-4 border rounded-lg shadow-sm ${
                      index === 0 ? "bg-green-50 border-green-300" : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        {bid.users?.name ?? "Unknown User"}
                      </span>
                      <span className="font-semibold text-lg text-gray-900">
                        ${bid.bid.amount}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTimestamp(bid.bid.timestamp)}
                    </div>
                    {index === 0 && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        Highest Bid
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
