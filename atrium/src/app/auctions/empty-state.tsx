import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src="/undraw_no-data_ig65.svg"
        width={400}
        height={400}
        alt="No items found"
        className="mx-auto mb-6"
        priority
      />
      <h2 className="text-2xl font-bold mb-4">You have no items yet</h2>
      <Button asChild>
        <Link href="/bids/create">Create Auction</Link>
      </Button>
    </div>
  );
}
