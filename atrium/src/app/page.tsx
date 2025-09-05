import { database } from "@/db/database";
import { bids as bidsScehma, items} from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache";
import SignIn from "@/components/ui/sign-in";
import { SignOut } from "@/components/ui/sign-out";
import { auth } from "@/auth";


export default async function Home() {
  const bids = await database.select().from(bidsScehma);
  const allItems = await database.select().from(items);
  const session = await auth();
  if (!session) return null;
  if (!session?.user) return null;
  const user = session?.user;

  return (
    <main className="container mx-auto py-12">

      {session ? <SignOut/>: <SignIn/>}
      {session?.user?.name}
     
      <form action={async(formData:FormData)=>{
        'use server';
        //const bid=formData.get('bid') as string;
        await database.insert(items).values({
          name: formData.get("name") as string,
          userId: session?.user?.id!,
        });
        revalidatePath('/'); //auto refresh
        }}>
        <Input name="name" placeholder="Add Item" />
        <Button type="submit">Add Item</Button>
      </form>

      {allItems.map((item)=>(
        <div key={item.id}>{item.name}</div>
      ))}
    </main>
  );
}
