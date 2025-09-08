import { database } from "@/db/database";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getImgUrl } from "@/util/files";
import { formatDistance } from "date-fns";

function formatTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), { addSuffix: true });
}

export default async function ItemPage({
  params,
}: {
  params: { itemId: string };
}) {
  const id = parseInt(params.itemId, 10);

  const [item] = await database
    .select()
    .from(items)
    .where(eq(items.id, id))
    .limit(1);

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

  const bids: {
    id: number;
    amount: number;
    bidder: string;
    timestamp: Date;
  }[] = [
    // { id: 1, amount: 150, bidder: "Alice", timestamp: new Date() },
    // { id: 2, amount: 200, bidder: "Bob", timestamp: new Date() },
    // { id: 3, amount: 250, bidder: "Charlie", timestamp: new Date() },
  ];

  const hasBids = bids.length > 0;

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left side: Item details */}
        <div className="space-y-6">
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

        {/* Right side: Bids */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Current Bids</h2>

          {!hasBids ? (
            <p className="text-gray-500 italic">No bids yet. Be the first!</p>
          ) : (
            <ul className="space-y-3">
              {bids.map((bid) => (
                <li
                  key={bid.id}
                  className="p-4 border rounded-lg bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {bid.bidder}
                    </span>
                    <span className="font-semibold text-lg text-gray-900">
                      ${bid.amount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimestamp(bid.timestamp)}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Button className="w-full">Place a Bid</Button>
        </div>
      </div>
    </main>
  );
}
