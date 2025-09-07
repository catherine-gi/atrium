import Image from "next/image";
import { getImgUrl } from "@/util/files";
import { Item } from "@/db/schema";

export function ItemCard({item}:{item:Item}){
    return(
        <div
            key={item.id}
            className="bg-white border shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="relative w-full h-56">
              <Image
                src={getImgUrl(item.fileKey)}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-sm text-gray-600">
                Starting Price:{" "}
                <span className="font-bold text-gray-900">
                  ${item.startingPrice}
                </span>
              </p>
            </div>
          </div>
    );
}
