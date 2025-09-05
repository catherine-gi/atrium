import { auth } from "@/auth";
import SignIn from "@/components/ui/sign-in";
import { SignOut } from "@/components/ui/sign-out";
import  Link  from "next/link";
import Image from "next/image";

export async function Header() {
  const session = await auth();

  return (
    <header className="p-4 bg-gray-200">
      <div className="container flex items-center justify-between">
        <Link href="/" className="hover:underline">
            {/* Left side: logo + title */}
            <div className="flex items-center gap-2">
            <Image src="/logo.png" width="50" height={50} alt="Atrium Logo" />
            <h1 className="text-2xl font-bold">Atrium</h1>
            </div>
        </Link>
        <Link href="/bids/create" className="hover:underline">
          Post an Item
        </Link>

        {/* Right side: user + auth button */}
        <div className="flex items-center gap-4">
          {session?.user?.name && (
            <span className="text-gray-700">{session.user.name}</span>
          )}
          {session ? <SignOut /> : <SignIn />}
        </div>
      </div>
    </header>
  );
}
