'use client';
import Link from "next/link";
import Image from "next/image";
import { NotificationFeedPopover, NotificationIconButton } from "@knocklabs/react";
import { useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const session = useSession();
  const user = session.data?.user;

  return (
    <header className="p-4 bg-gray-200">
      <div className="container flex items-center justify-between">
        {/* Left side: logo + title */}
        <Link href="/" className="hover:underline">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={50} height={50} alt="Atrium Logo" />
            <h1 className="text-2xl font-bold">Atrium</h1>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">All Auctions</Link>
          <Link href="/bids/create" className="hover:underline">Create Auction</Link>
          <Link href="/auctions" className="hover:underline">My Auctions</Link>
        </div>

        {/* Right side: notifications + auth */}
        <div className="flex items-center gap-4">
          {/* ✅ Only show notifications if logged in */}
          {user && (
            <>
              <NotificationIconButton
                ref={notifButtonRef}
                onClick={() => setIsVisible(!isVisible)}
              />
              <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
              />
              <span className="text-gray-700">{user.name}</span>
            </>
          )}

          {user ? (
            <Button onClick={() => signOut({ callbackUrl: "/" })}>
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => signIn()}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
