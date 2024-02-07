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

  const checkPW = (value: string) => {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numericRegex = /[0-9]/;
    const nonAlphanumericRegex = /[^A-Za-z0-9]/;
    setPassword(value)
    if (value.length < 6) {
      setfeedback('รหัสผ่านน้อยกว่า 6 ตัวอักษร')
    }
    else if (!lowercaseRegex.test(value)) {
      setfeedback('รหัสผ่านขาดตัวอักษรพิมพ์เล็ก')
    }
    else if (!uppercaseRegex.test(value)) {
      setfeedback('รหัสผ่านขาดตัวอักษรพิมพ์ใหญ่')
    }
    else if (!numericRegex.test(value)) {
      setfeedback('รหัสผ่านขาดตัวเลข')
    }
    else {
      setfeedback('')
    }
    // else if(!nonAlphanumericRegex.test(value)){
    //   setfeedback('รหัสผ่านขาดตัวอักษรพิเศษ')
    // }
  }

  // เจ๊งอะ
  // const checkPW2 = (value: string) => {
  //   console.log(password, password2)
  //   setPassword2(value)
  //   if (password != password2) {
  //     setfeedback('รหัสผ่านไม่สอดคล้องกัน')
  //   }
  //   else{
  //     setfeedback('')
  //   }
  // }

  const signup = () => {
    if (password != password2) {
      console.log('password != password2')
      setfeedback('รหัสผ่านไม่สอดคล้องกัน')
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // var user = userCredential.user; 
          console.log('signup complete')
          setfeedback('สมัครสมาชิกสำเร็จ')
          // setTimeout(() => {
          //   router.push("/")
          // }, 1000)
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
              onChange={(e) => checkPW(e.target.value)}
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
