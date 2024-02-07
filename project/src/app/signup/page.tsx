"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Mali } from "@next/font/google";
const mali = Mali({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600"],
});

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const router = useRouter();
  let [feedback, setfeedback] = useState("feedback signup");

  const signup = () =>{
    if(password.length <= 8){
        console.log('password < 8')
        setfeedback('พาสเวิร์ดน้อยกว่า 9 คัวอักษร')
    }
    else if(password != password2){
        console.log('password != password2')
        setfeedback('พาสเวิร์ดไม่สอดคล้องกัน')
    }
    else{
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          setfeedback('สมัครสมาชิกสำเร็จ')
          setTimeout(()=>{
            router.push("/")
          }, 1000)
        })
        .catch((error) => {
          setfeedback(error.message)
        });
    }
    
  }

  return (
    <div className={mali.className}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <div className="container px-4">
          <form className="flex flex-col gap-4" action="#">
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 rounded-md ring-1 ring-black"
              type="username"
              name="username"
              id="username"
              required
              placeholder="ชื่อผู้ใช้งาน"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 rounded-md ring-1 ring-black"
              type="email"
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
              required
              placeholder="รหัสผ่าน"
            />
            <input
              onChange={(e) => setPassword2(e.target.value)}
              className="px-3 py-2 rounded-md ring-1 ring-black"
              type="password"
              name="password2"
              id="password2"
              required
              placeholder="ยืนยันรหัสผ่าน"
            />
            <p id="feedback-signup">{feedback}</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="disable:opacity-40 px-2 py-3  ring-1 ring-black  rounded-md hover:bg-primary transition duration-200 ease-in-out"
                onClick={() => router.push("/signin")}
              >
                เข้าสู่ระบบ
              </button>
              <button
                className="disabled:opacity-40 px-2 py-3 bg-black text-white  rounded-md"
                onClick={() => signup()}
                disabled={!email || !password || !password2 || !username}
                
              >
                สมัครสมาชิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
