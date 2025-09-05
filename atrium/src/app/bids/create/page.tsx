import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {createItemAction} from "@/app/bids/create/actions"

import { auth } from "@/auth";


export default async function createPage() {
  //const bids = await database.select().from(bidsScehma);
  //const allItems = await database.select().from(items);
  const session = await auth();
  //if (!session) return null;
  //if (!session?.user) return null;
  const user = session?.user;

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Post an Item to sell</h1>


     
      <form 
      className="flex border py-4 px-4 gap-2 mb-4 rounded-xl space-y-4 w-fit"
      action={createItemAction}>
        <Input required name="name" placeholder="Add Item" />
        <Input required name="startingPrice" type="number" placeholder="Start Price" />
        <Button type="submit">Add Item</Button>
      </form>


    </main>
  );
}
