import Image from "next/image";
import { getImgUrl } from "@/util/files";
import { Item } from "@/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { isBidOver } from "@/util/bids";



export function ItemCard({ item }: { item: Item }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="relative w-full h-56 mb-3">
        <Image
          src={getImgUrl(item.fileKey)}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <h2 className="text-lg font-medium text-gray-800">{item.name}</h2>
      <p className="text-sm text-gray-600 mb-2">
        Starting Price:{" "}
        <span className="font-semibold text-gray-900">
          ${item.startingPrice}
        </span>
      </p>

      {isBidOver(item) ? (
        <div className="text-red-600 font-bold mb-2">Auction Ended</div>
      ) : (
        <div className="text-gray-700 mb-2">
          Ends on: {format(item.endDate, "PPP")}
        </div>
      )}

      <Button asChild
      variant={isBidOver(item) ? "outline" : "default"}>
        <Link href={`/bids/${item.id}`}>
        {isBidOver(item) ? "View Results" : "Place a Bid"}
        </Link>
      </Button>
    </div>
  );
}
