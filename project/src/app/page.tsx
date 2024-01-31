'use client';
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  })
  
  return (
    <main className="min-h-screen flex-col items-center justify-between p-24">
      <div className="container px-4">
        <div>
          <div>{session?.data?.user?.email}</div>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      </div>
    </main>
  );
}

Home.requireAuth = true
