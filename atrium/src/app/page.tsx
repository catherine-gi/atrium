import { database } from "@/db/database";
import { bids as bidsScehma, items } from "@/db/schema";
import { auth } from "@/auth";
import Image from "next/image";
import { getImgUrl } from "@/util/files";
import { ItemCard } from "@/app/item-card";


export default async function Home() {
  const bids = await database.select().from(bidsScehma);
  const allItems = await database.select().from(items);
  const session = await auth();
  const user = session?.user;

  // function getImgUrl(fileKey: string) {
  //   return `${env.NEXT_PUBLIC_BUCKET_URL}${fileKey}`;
  // }

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        Items for Sale
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {allItems.map((item) => ( <ItemCard  key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
