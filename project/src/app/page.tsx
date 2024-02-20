'use client';
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { db } from "./firebase";
import { useState } from "react";
import Background from "./component/Background";
import ImageComp from "./component/ImageComp";
import { useRouter } from "next/navigation";

import { getDatabase, ref, set, onValue, update, remove, child, get } from "firebase/database";

// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";





// import { Mali } from "@next/font/google";
// import ImageComp from "./component/ImageComp";
// const mali = Mali({
//   subsets: ["latin", "thai"],
//   weight: ["200", "300", "400", "500", "600"],
// });

export default function Home() {
  const router = useRouter()
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  })

  const [email, setEmail] = useState("Loading...");
  const [username, setUsername] = useState("Loading...");
  const [img, setImg] = useState("/image/icon1.svg");
  const [userid, setUserid] = useState("Loading...");

  const [invite, setInvite] = useState('')
  const [showLogout, setShowLogout] = useState(false)

  let readUser = (uid: string) => {
    const userListref = ref(db, `UserList/${uid}`);
    onValue(userListref, (snapshot: any) => {
      const data = snapshot.val();
      // console.log(data)
      setUserid(uid)
      setEmail(data.email)
      setImg(data.profile_img)
      setUsername(data.username)
    });
  }

  const getUserUid = async (email: string) => {
    const userListRef = ref(db, `UserList`);
    let uid;

    await onValue(userListRef, (snapshot: any) => {
      const data = snapshot.val();
      Object.keys(data).forEach((key) => {
        // console.log('key : ', data[key].email)
        if (data[key].email === email) {
          uid = key; // Found the user's UID
          return;
        }
      });
    });

    return uid;
  };

  const fetchUserData = async () => {
    const email = session?.data?.user?.email;
    if (email) {
      const uid = await getUserUid(email);
      if (uid != null) {
        readUser(uid)
        invitation()
      }
    }
  };

  fetchUserData(); // Fetch user data when the component mounts

  const invitation = async () => {
    const inviting = ref(db, `inviting`);
    await onValue(inviting, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach((key) => {
          if (key == userid) {

            console.log('you have to invite', data[key]['roomId'])
            setInvite(data[key]['roomId'])

          }
        });
      }
    });
  }

  const removeInvite = () => {
    remove(ref(db, `inviting/${userid}`));
  }
  return (
    <>
      <div className=''>
        <main className="min-h-screen items-center relative overflow-hidden">
          <Background />

          {showLogout?
            <div className="absolute h-full w-full flex z-20 bg-[#0005]">
              <div className=" m-auto bg-white ring-2 ring-black p-10 rounded-lg grid gap-8">
                <div className="text-center">ออกจากระบบ</div>
                <div className="grid grid-cols-2 gap-8">

                <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                  onClick={() => signOut()}>ยืนยัน</button>
                <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                  onClick={() => { setShowLogout(false) }}>ยกเลิก</button>
             
                  </div>
              </div>
            </div>:null
          }

          {invite == '' ? null :
            <div className="absolute h-full w-full flex z-20 bg-[#0005]">
              <div className=" m-auto bg-white ring-2 ring-black p-10 rounded-lg grid gap-8">
                <div className="text-center">ได้รับคำเชิญ !</div>
                <div className="grid grid-cols-2 gap-8">

                <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                  onClick={() => { router.push(`/waitingroom?intend=${invite}`); removeInvite() }}>เข้าร่วม</button>
                <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                  onClick={() => { setInvite(''); removeInvite() }}>ปฏิเสธ</button>
             
                  </div>
              </div>
            </div>
          }

          <div className="min-h-screen flex">
            <div className="container px-6 relative z-10 my-auto mx-auto">
              <div className="">
                <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
                  <div id="profile" className="ring-2 ring-black rounded-xl bg-white">
                    <div className="px-6 py-2">
                      <button className="w-5 mr-2">
                        <ImageComp path='/image/icon/setting.svg' />
                      </button>
                      <button onClick={() => {setShowLogout(true)}} className="w-5">
                        <ImageComp path='/image/icon/logout.svg' />
                      </button>
                    </div>

                    <div className="w-full ring-black ring-1 "></div>

                    <div className="grid grid-cols-2 md:grid-cols-1 p-6">
                      <div className='md:w-2/5 md:mx-auto'>
                        <ImageComp path={img} />
                      </div>

                      <div className="pl-4 md:pl-0 md:pt-4 my-auto md:text-center">
                        <div className="text-4xl mb-3 font-medium">{username}</div>
                        <div>อัตราชนะ <span className="text-primary">xx</span></div>
                        <div>คะแนน <span className="text-primary">xx</span></div>
                      </div>
                    </div>
                  </div>
                  <div id="leaderboard" className="ring-2 ring-black rounded-xl bg-white p-6">
                    <div className="text-center h-20 text-lg">เป็ดดีเด่น...</div>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <button className='ring-2 ring-black rounded-lg bg-white py-2 md:py-4 text-center hover:scale-105' onClick={() => { router.push('/waitingroom?intend=challenge') }}>สุ่มห้อง</button>
                  <button className="ring-2 ring-black rounded-lg bg-white py-2 md:py-4 hover:scale-105" onClick={() => { router.push('/waitingroom?intend=custom') }}>สร้างห้อง</button>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}

Home.requireAuth = true
