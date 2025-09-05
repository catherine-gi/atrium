import { database } from "@/db/database";
import { bids as bidsScehma, items} from "@/db/schema";
import { auth } from "@/auth";



export default async function Home() {
  const bids = await database.select().from(bidsScehma);
  const allItems = await database.select().from(items);
  const session = await auth();
  const user = session?.user;

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Items for Sale</h1>  
      <div className="grid grid-cols-4 gap-6">
        {allItems.map((item)=>(
          <div key={item.id} className="border p-8 rounded-xl">
            {item.name}
            <div>
              Starting Price: ${item.startingPrice}
            </div>
            
          </div>
        
        ))}
      </div>
    </main>
  );
}
