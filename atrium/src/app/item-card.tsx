import Image from "next/image";
import { getImgUrl } from "@/util/files";
import { Item, items } from "@/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ItemCard({ item }: { item: Item }) {
  return (
    <div>
      <div className="relative w-full h-56 mb-3">
        <Image
          src={getImgUrl(item.fileKey)}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <h2 className="text-lg font-medium text-gray-800">{item.name}</h2>
      <p className="text-sm text-gray-600">
        Starting Price:{" "}
        <span className="font-semibold text-gray-900">
          ${item.startingPrice}
        </span>
      </p>
      <Button asChild>
        <Link href={`/bids/${item.id}`}>Place Bid</Link>
      </Button>
    </div>
  );
}
