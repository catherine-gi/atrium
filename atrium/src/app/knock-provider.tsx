'use client';
import {
  KnockFeedProvider,
  KnockProvider,
  NotificationFeedPopover,
  NotificationIconButton,
} from "@knocklabs/react";
import { env } from "@/env";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";

export function AppKnockProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();

  return (
    <KnockProvider
      apiKey={env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
      user={{
        id: session.data?.user?.id ?? "guest",
        name: session.data?.user?.name ?? "Guest",
        email: session.data?.user?.email ?? undefined,
      }}
    >
      <KnockFeedProvider feedId={env.NEXT_PUBLIC_KNOCK_FEED_ID}>
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
}


// export function AppKnockProvider({children}:{children:React.ReactNode}) {
//   const [isVisible, setIsVisible] = useState(false);
//   const notifButtonRef = useRef(null);
//   const session = useSession();

//   if(!session.data?.user?.id){
//     return <>{children}</>
//   }

//   return (
//       <KnockProvider 
//         apiKey={env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
//         user={{
//           id: session?.data?.user?.id ?? "guest",
//           name: session?.data?.user?.name ?? "Guest User",
//           email: session?.data?.user?.email ?? undefined,
//         }}>

//       <KnockFeedProvider feedId={env.NEXT_PUBLIC_KNOCK_FEED_ID}>
//         {children}
//       </KnockFeedProvider>
//     </KnockProvider>
//   );
// };