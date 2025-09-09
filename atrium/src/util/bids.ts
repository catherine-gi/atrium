import { Item } from "@/db/schema";
export function isBidOver(item:Item){
  return new Date() > item.endDate;
}
