import { database } from "@/db/database";
import { bids as bidsScehma} from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";
import SignIn from "@/components/ui/sign-in";
import { SignOut } from "@/components/ui/sign-out";
import { auth } from "@/auth";


export default async function Home() {
  const bids =await database.query.bids.findMany();
  const session = await auth();

  return (
    <main className="container mx-auto py-12">

      {session ? <SignOut/>: <SignIn/>}
      {session?.user?.name}
     
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
