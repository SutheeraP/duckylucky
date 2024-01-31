"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Mali } from "@next/font/google";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
const mali = Mali({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600"],
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const resetEmail = () => {
     sendPasswordResetEmail(auth, email);
  }

  return (
    <div className={mali.className}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <div className="container px-4">
          <form className="flex flex-col gap-4" action="#">
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="px-2 py-3 rounded-md ring-1 ring-black"
              type="text"
              name="username"
              id="username"
              required
              placeholder="อีเมลล์"
            />
            <button
                className="px-2 py-3 bg-black text-white rounded-md hover:bg-primary transition duration-200 ease-in-out"
                onClick={() => resetEmail()}
                disabled={!email}
              >
                รับรหัสผ่าน
              </button>
          </form>
        </div>
      </div>
    </div>
  );
}
