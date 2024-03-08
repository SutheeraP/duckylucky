"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

// import { Mali } from "@next/font/google";
// const mali = Mali({
//   subsets: ["latin", "thai"],
//   weight: ["200", "300", "400", "500", "600"],
// });

import { getDatabase, ref, set, onValue, get } from "firebase/database";
import Icon from "../component/ImageComp";
import Background from "../component/Background";
import ImageComp from "../component/ImageComp";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [usernameList, setUsernameList] = useState<string[]>([]);
  const [icon, setIcon] = useState("/image/icon1.svg");
  const router = useRouter();
  const [feedback, setfeedback] = useState("");
  const [color, setcolor] = useState("text-red-600");
  const iconPath = ["/image/icon1.svg", "/image/icon2.svg", "/image/icon3.svg", "/image/icon4.svg", "/image/icon5.svg", "/image/icon6.svg"]


  const checkPW = (value: string) => {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numericRegex = /[0-9]/;
    setPassword(value)
    if (!lowercaseRegex.test(value)) {
      setfeedback('รหัสผ่านขาดตัวอักษรพิมพ์เล็ก')
    }
    else if (!uppercaseRegex.test(value)) {
      setfeedback('รหัสผ่านขาดตัวอักษรพิมพ์ใหญ่')
    }
    else if (!numericRegex.test(value)) {
      setfeedback('รหัสผ่านขาดตัวเลข')
    }
    else if (value.length < 6) {
      setfeedback('รหัสผ่านน้อยกว่า 6 ตัวอักษร')
    }
    else {
      setfeedback('')
    }
  }

  const userRef = ref(db, `UserList`);
  const getUser = async () => {
    const data = (await get(userRef)).val()
    setUsernameList([])
    if (data) {
      Object.keys(data).forEach((key) => {
        usernameList.push(data[key].username)
      });
    }
  }

  // const getUsernameList = async () => {
  //   let usernameList: string[] = [];


  //   const userListRef = ref(db, `UserList`);
  //   await onValue(userListRef, (snapshot: any) => {
  //     const data = snapshot.val();
  //     Object.keys(data).forEach((key) => {
  //       usernameList.push(data[key].username)
  //     });
  //   });
  //   // console.log('after get : ', usernameList)
  //   return usernameList
  // }
  // getUsernameList(); // get

  async function signup() {
    // await getUser()
    console.log(usernameList)

    if (usernameList.includes(username)) {
      console.log('uname', username)
      setfeedback('ชื่อผู้ใช้งานซ้ำ')
    }
    else 
    if (password != password2) {
      setfeedback('รหัสผ่านไม่สอดคล้องกัน')
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          // console.log('user', user)
          setcolor('text-green-600')
          setfeedback('สมัครสมาชิกสำเร็จ')
          writeUserData(user.uid, username, email, icon)

          setTimeout(() => {
            signIn('credentials', { email, password, redirect: true, callbackUrl: '/' })
            // router.push("/")
          }, 500)
        })
        .catch((error) => {
          if (error.message == 'Firebase: Error (auth/email-already-in-use).') {
            setfeedback('Email มีผู้ใช้งานแล้ว')
          }
          else {
            setfeedback(error.message)
          }
        });
    }
    setcolor('text-red-600');
    console.log('end signup')
  }

  function writeUserData(userId: any, name: string, email: string, imageUrl: string) {
    console.log('write data')
    const db = getDatabase();
    set(ref(db, `UserList/${userId}`), {
      username: name,
      email: email,
      profile_img: imageUrl,
      score: 0,
      match: 0,
      win: 0
    });
  }

  let clickIcon = (path: any) => {
    setIcon(path)
  }


  return (
    <div className=''>
      <div className="min-h-screen w-full relative overflow-hidden">
        <Background />
        <div className="min-h-screen flex">
          <div className="container px-4 z-10 m-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="w-4/5 mx-auto hidden md:block my-auto"><ImageComp path='/image/icon/logo.svg' /></div>
              <div className="my-auto">
                <div className="text-4xl lg:text-6xl text-center font-medium mb-8 bg-white lg:bg-transparent py-2 rounded-lg">Ducky Lucky</div>
                <div id="signup_section" className="md:w-4/5 lg:w-3/5 mx-auto">
                  <div className="grid grid-cols-3 gap-x-10 gap-y-5 mb-7">
                    {iconPath.map((path, index) => (
                      <div key={index} className={`cursor-pointer rounded-full ${path == icon ? 'grayscale-0 ring-2 ring-black' : ''}`} onClick={() => { clickIcon(path) }}>
                        <Icon path={path} />
                      </div>

                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    <input
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none px-3 py-2 rounded-md ring-1 ring-black"
                      type="username"
                      name="username"
                      id="username"
                      required
                      placeholder="ชื่อผู้ใช้งาน"
                    />
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none px-3 py-2 rounded-md ring-1 ring-black"
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder="อีเมลล์"
                    />
                    <input
                      onChange={(e) => checkPW(e.target.value)}
                      className="appearance-none px-3 py-2 rounded-md ring-1 ring-black"
                      type="password"
                      name="password"
                      id="password"
                      required
                      placeholder="รหัสผ่าน"
                    />
                    <input
                      onChange={(e) => setPassword2(e.target.value)}
                      className="appearance-none px-3 py-2 rounded-md ring-1 ring-black"
                      type="password"
                      name="password2"
                      id="password2"
                      required
                      placeholder="ยืนยันรหัสผ่าน"
                    />
                    {feedback != "" ? <p className={`${color} bg-white py-1 rounded-md`} id="feedback-signup">{feedback}</p> : ""}

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        className="disable:opacity-40 px-2 py-2 bg-black text-white  rounded-md hover:bg-primary hover:scale-105 transition duration-200 ease-in-out"
                        onClick={() => router.push("/signin")}
                      >
                        เข้าสู่ระบบ
                      </button>
                      <button
                        className="disabled:opacity-40 px-2 py-2 bg-black text-white hover:bg-primary hover:scale-105 rounded-md transition duration-200 ease-in-out"
                        onClick={() => signup()}
                        disabled={!email || !password || !password2 || !username}
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
