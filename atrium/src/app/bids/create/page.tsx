'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItemAction, createUploadUrlAction } from "@/app/bids/create/actions";
import { DatePickerDemo } from "@/components/ui/date-picker";
import { useState } from "react";

export default function CreatePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Post an Item to Sell</h1>

      <form
        className="flex flex-col border py-4 px-4 gap-4 mb-4 rounded-xl w-fit"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const formData = new FormData(form);

          const file = formData.get("file") as File | null;
          if (!file) {
            alert("Please select a file before submitting.");
            return;
          }

          // Get signed upload URL
          const uploadUrl = await createUploadUrlAction(file.name, file.type);

          // Upload file directly to storage bucket
          await fetch(uploadUrl, {
            method: "PUT",
            body: file,
          });

          // Ensure date is set
          if (!date) {
            alert("Please select an end date");
            return;
          }

          // Create item entry in DB
          await createItemAction({
            name: formData.get("name") as string,
            startingPrice: Number(formData.get("startingPrice")),
            fileName: file.name,
            endDate: date, // ✅ now safe
          });

          form.reset();
          setDate(new Date());
          alert("Item posted successfully!");
        }}
      >
        <Input required name="name" placeholder="Add Item" />
        <Input required name="startingPrice" type="number" placeholder="Start Price" />
        <Input required name="file" type="file" accept="image/*" />
        <DatePickerDemo date={date} setDate={setDate} />
        <Button type="submit">Post Item</Button>
      </form>
    </main>
  );
}
