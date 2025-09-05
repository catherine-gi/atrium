'use server'
import { revalidatePath } from "next/cache";
import { database } from "@/db/database";
import { items } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createItemAction(formData: FormData) {
    const session = await auth();
    if (!session) {
        throw new Error("Not authenticated");
    }
    const user = session.user;
    if(!user || !user.id) {
        throw new Error("No user found");
    }
 
        //const bid=formData.get('bid') as string;
        await database.insert(items).values({
          name: formData.get("name") as string,
          startingPrice: Number(formData.get("startingPrice")),
          userId: user.id,
        });
        redirect('/'); //auto refresh
        
}