'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import {createItemAction} from "@/app/bids/create/actions"
import {createUploadUrlAction} from "@/app/bids/create/actions"



export default function createPage() {
 

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Post an Item to sell</h1>


     
      <form 
      className="flex border py-4 px-4 gap-2 mb-4 rounded-xl space-y-4 w-fit"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const file = formData.get("file") as File;
        const uploadUrl = await createUploadUrlAction(file.name,file.type); //storing to bucket directly from user's browser
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          
        })
        await createItemAction({
          name: formData.get("name") as string,
          startingPrice: Number(formData.get("startingPrice")),
          fileName: file.name,
        });
      }}>
        <Input required name="name" placeholder="Add Item" />
        <Input required name="startingPrice" type="number" placeholder="Start Price" />
        <Input required name="file" type="file" placeholder="Image" />
        <Button type="submit">Post Item</Button>
      </form>


    </main>
  );
}
