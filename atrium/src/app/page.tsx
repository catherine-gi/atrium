import { database } from "@/db/database";
import { bids as bidsScehma} from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";


export default async function Home() {
  const bids =await database.query.bids.findMany();
  return (
    <main className="container mx-auto py-12">
      <form action={async(formData:FormData)=>{
        'use server';
        //const bid=formData.get('bid') as string;
        await database.insert(bidsScehma).values({});
        revalidatePath('/'); //auto refresh
        }}>
        <Input name="bid" placeholder="Bid Amount" />
        <Button type="submit">Submit</Button>
      </form>

      {bids.map((bid)=>(
        <div key={bid.id}>{bid.id}</div>
      ))}
    </main>
  );
}
