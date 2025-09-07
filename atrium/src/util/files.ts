  import {env} from "@/env";

  export function getImgUrl(fileKey: string) {
    return `${env.NEXT_PUBLIC_BUCKET_URL}${encodeURIComponent(fileKey)}`;
  }