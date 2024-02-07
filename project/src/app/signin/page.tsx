"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Mali } from "@next/font/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
const mali = Mali({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600"],
});

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [feedback, setfeedback] = useState("");
  const router = useRouter();

  const signin = () => {
    console.log('click')
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        setfeedback('เข้าสู้ระบบสำเร็จ')
        console.log('login', user)

        setTimeout(() => {
          console.log('timeout')
          signIn('credentials', { email, password, redirect: true, callbackUrl: '/' })
          router.push("/")
          
        }, 1000)
      })
      .catch((error) => {
        setfeedback(error.message)
      });
setEmail('')
          setPassword('')
  }


  return (
    <div className={mali.className}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <div className="container px-4">
          <form className="flex flex-col gap-4" action="#">
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 rounded-md ring-1 ring-black"
              type="email"
              value={email}
              name="email"
              id="email"
              required
              placeholder="อีเมลล์"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 rounded-md ring-1 ring-black"
              type="password"
              name="password"
              id="password"
              value={password}
              required
              placeholder="รหัสผ่าน"
            />
            <p id="feedback-signin">{feedback}</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                name="signin"
                className="disabled:opacity-40 px-2 py-3 bg-black text-white rounded-md hover:bg-primary transition duration-200 ease-in-out"
                // onClick={() => signIn('credentials', {email, password, redirect: true, callbackUrl: '/'})}
                onClick={() => signin()}
              // disabled={!email || !password}
              >
                เข้าสู่ระบบ
              </button>
              <button
                name="signup"
                className="px-2 py-3 ring-1 ring-black rounded-md"
                onClick={() => router.push("/signup")}
              >
                สมัครสมาชิก
              </button>
            </div>
            <p onClick={() => router.push('/forgot-password')} className="text-center text-slate-500 text-sm">forgot password?</p>
          </form>
        </div>
      </div>
    </div>
  );
}
