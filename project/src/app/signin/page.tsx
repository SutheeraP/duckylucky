"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";



import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

// import { Mali } from "@next/font/google";
import Background from "../component/Background";
import ImageComp from "../component/ImageComp";
// const mali = Mali({
//   subsets: ["latin", "thai"],
//   weight: ["200", "300", "400", "500", "600"],
// });

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [feedback, setfeedback] = useState("");
  const router = useRouter();
  let [color, setcolor] = useState("text-red-600");

  const signin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        setcolor('text-green-600')
        setfeedback('เข้าสู้ระบบสำเร็จ')
        console.log('login', user)

        setTimeout(() => {
          signIn('credentials', { email, password, redirect: true, callbackUrl: '/' })
          // router.push("/")
        }, 1000)
      })
      .catch((error) => {
        setfeedback(error.message)
      });
    // setEmail('')
    // setPassword('')
  }


  return (
    <div className='font-Mali'>
      <div className="min-h-screen w-full relative overflow-hidden">
        <Background />
        <div className="min-h-screen flex">
          <div className="container px-4 z-10 m-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="w-4/5 mx-auto"><ImageComp path='/image/icon/logo.svg' /></div>
              <div className="my-auto">
                <div className="text-4xl lg:text-6xl text-center font-medium mb-8">Ducky Lucky</div>
                <div id="signup_section" className="md:w-4/5 mx-auto">
                  <div className="flex flex-col gap-4">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none px-3 py-2 rounded-md ring-1 ring-black"
                      type="email"
                      value={email}
                      name="email"
                      id="email"
                      required
                      placeholder="อีเมลล์"
                    />
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none px-3 py-2 rounded-md ring-1 ring-black"
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      required
                      placeholder="รหัสผ่าน"
                    />
                    <p className={`font-semibold ${color}`} id="feedback-signin">{feedback}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        name="signin"
                        className="disabled:opacity-40 px-2 py-3 bg-black text-white font-semibold rounded-md hover:bg-primary transition duration-200 ease-in-out"
                        // onClick={() => signIn('credentials', {email, password, redirect: true, callbackUrl: '/'})}
                        onClick={() => signin()}
                      // disabled={!email || !password}
                      >
                        เข้าสู่ระบบ
                      </button>
                      <button
                        name="signup"
                        className="px-2 py-3 ring-1 ring-black bg-white rounded-md font-semibold"
                        onClick={() => router.push("/signup")}
                      >
                        สมัครสมาชิก
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
