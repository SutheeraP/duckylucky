'use client';
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { db } from "./firebase";
import { useState } from "react";
import Background from "./component/Background";
import ImageComp from "./component/ImageComp";
import { useRouter } from "next/navigation";

import { getDatabase, ref, set, onValue, update, remove, child, get } from "firebase/database";

export default function Home() {
  const router = useRouter()
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  })

  // base
  const [email, setEmail] = useState("Loading...");
  const [username, setUsername] = useState("Loading...");
  const [img, setImg] = useState("/image/icon1.svg");
  const [currentUid, setcurrentUid] = useState("Loading...");

  // extension
  const [invite, setInvite] = useState('')
  const [showLogout, setShowLogout] = useState(false)

  // for edit profile
  const [editIcon, setEditIcon] = useState("/image/icon1.svg");
  const [editName, setEditName] = useState("ชื่อผู้ใช้งานใหม่");
  const [feedback, setFeedback] = useState('');
  const [usernameList, setUsernameList] = useState<string[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const iconPath = ["/image/icon1.svg", "/image/icon2.svg", "/image/icon3.svg", "/image/icon4.svg", "/image/icon5.svg", "/image/icon6.svg"]
  const [color, setcolor] = useState("text-red-600");

  // data
  const userListRef = ref(db, `UserList`);
  const emailAuth = session?.data?.user?.email;

  interface User {
    email: string;
    profile_img: string;
    username: string;
  }

  interface Inviter {
    inviter: string;
    roomId: string;
  }

  const readData = (data: Record<string, unknown>) => {
    console.log(usernameList)
    if (usernameList.length == 0) {
      Object.keys(data).forEach((key) => {

        let obj = data[key] as User

        if (usernameList.length == 0) {
          if (!usernameList.includes(obj.username)) {
            setUsernameList(prevList => [...prevList, obj.username])
          }
        }


        if (username == "Loading..." && obj.email === emailAuth) {
          setcurrentUid(key)
          setEmail(obj.email)
          setImg(obj.profile_img)
          setUsername(obj.username)

          setEditIcon(obj.profile_img)
          setEditName(obj.username)
        }
      });
    }
  }

  const readInvite = (data: Record<string, object>) => {
    if (data) {
      Object.keys(data).forEach((key) => {
        if (key == currentUid && invite == '') {
          let obj = data[key] as Inviter
          setInvite(obj.roomId)
          // console.log(obj)
        }
      });
    }
  }

  const inviting = ref(db, `inviting`);
  onValue(inviting, (snapshot: any) => {
    const data = snapshot.val();
    readInvite(data)
  });

  onValue(userListRef, (snapshot: any) => {
    if (username == "Loading...") {
      const data = snapshot.val();
      readData(data)
    }

  });

  const removeInvite = () => {
    remove(ref(db, `inviting/${currentUid}`));
  }

  const saveEditProfile = () => {
    console.log(currentUid, editName, editIcon)
    console.log(usernameList)
    // validate username

    if (editName != username && usernameList.includes(editName)) {
      console.log('ซ้ำ')
      setFeedback('ชื่อผู้ใช้งานซ้ำ')
    }
    else {
      update(ref(db, `UserList/${currentUid}`), {
        username: editName,
        profile_img: editIcon,
      });
      console.log('ผ่าน')
      // setUsernameList([])
      setFeedback('')
      setShowEdit(false)
    }

  }

  let clickIcon = (path: string) => {
    setEditIcon(path)
    // console.log(usernameList)
  }



  return (
    <>
      <div className=''>
        <main className="min-h-screen items-center relative overflow-hidden">
          <Background />

          {showEdit ?
            <div className="absolute h-full w-full flex z-20 bg-[#0005]">
              <div className="container px-6 m-auto md:w-[600px]">
                <div className=" bg-white ring-2 ring-black py-4 rounded-lg grid gap-8">
                  <div>
                    <div className="text-center mb-4">แก้ไขโปรไฟล์</div>
                    <div className="bg-black w-full h-[2px]" />
                  </div>
                  <div className="px-4 md:px-8 pb-3 grid gap-7">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-x-5 gap-y-5">
                      {iconPath.map((path, index) => (

                        <div key={index} className={`cursor-pointer rounded-full ${path == editIcon ? 'grayscale-0 ring-2 ring-black' : ''}`} onClick={() => { clickIcon(path) }}>
                          <ImageComp path={path} />
                        </div>

                      ))}
                    </div>
                    <input type="text" className="border-black border-2 w-full rounded-lg md:w-[200px] mx-auto p-2" placeholder={username} onChange={(e) => { setEditName(e.target.value) }}></input>
                    {feedback != "" ? <p className={`${color} bg-white py-1 rounded-md`} id="feedback-signup">{feedback}</p> : ""}
                    <div className="grid grid-cols-2 gap-4">
                      <button className="ring-2 ring-black rounded-lg bg-black text-white hover:bg-white hover:text-black py-2 px-6"
                        onClick={() => saveEditProfile()}>บันทึก</button>
                      <button className="ring-2 ring-black rounded-lg bg-black text-white hover:bg-white hover:text-black py-2 px-6"
                        onClick={() => { setShowEdit(false); setFeedback('') }}>ยกเลิก</button>
                    </div>
                  </div>
                </div>
              </div>
            </div> : null}

          {showLogout ?
            <div className="absolute h-full w-full flex z-20 bg-[#0005]">
              <div className="container px-4 m-auto md:w-96">
                <div className=" bg-white ring-2 ring-black px-4 py-8 rounded-lg grid gap-8">
                  <div className="text-center">ออกจากระบบ</div>
                  <div className="grid grid-cols-2 gap-8">
                    <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                      onClick={() => signOut()}>ยืนยัน</button>
                    <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                      onClick={() => { setShowLogout(false); setEditIcon(img) }}>ยกเลิก</button>
                  </div>
                </div>
              </div>
            </div> : null
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
                    <div className="px-3 py-2">
                      <button onClick={() => { setShowEdit(true); console.log(usernameList) }} className="w-5 mr-2">
                        <ImageComp path='/image/icon/setting.svg' />
                      </button>
                      <button onClick={() => { setShowLogout(true) }} className="w-5">
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
