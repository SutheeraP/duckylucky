'use client'

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getDatabase, ref, set, onValue, update, remove, child, get, push } from "firebase/database";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Invitation from "./component/Invitation";
import Background from "../component/Background";
import ImageComp from "../component/ImageComp";




const Waiting = (prop: any) => {
    const [status, setStatus] = useState('Loading...');
    const [p1username, setP1Username] = useState("Loading...");
    const [p1img, setP1Img] = useState("/image/icon1.svg");
    const [p2username, setP2Username] = useState("waiting...");
    const [p2img, setP2Img] = useState("/image/icon/waitP2.svg");
    const [showReady, setShowReady] = useState(false);
    const router = useRouter()
    const intend = prop['searchParams']['intend']
    const [currentUid, setCurrentUid] = useState<any>()
    const [roomId, setRoomId] = useState<any>()
    const [centerText, setCenterText] = useState<any>('VS')
    // const [roomStart, setRoomStart] = useState('')
    // const [p1uid, setP1uid] = useState('')
    // const [p2uid, setP2uid] = useState('')
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin');
        },
    })
    // useEffect(() => {
    // console.log('HiHi')
    const updateDataU = async () => {
        const waitingRef = ref(db, `waitingRoom`);

        await onValue(waitingRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((room) => {
                    console.log('object in update U : ', Object.keys(data[room]))
                    Object.keys(data[room]).forEach((key) => {
                        if (Object.keys(data[room]).length == 2 && data[room][key] === currentUid) {
                            console.log('found 2 player')
                            // setRoomStart(room)
                            // room ที่มีผู้เล่น 2 คน & มี value เป้นผู้เล่น 
                            // update profile ที่แสดง
                            // ซ้าย owner ขวา challenger

                            const dbRef = ref(getDatabase());
                            get(child(dbRef, `UserList/${data[room].owner}`)).then((snapshot) => {
                                if (snapshot.exists()) {
                                    setP1Username(snapshot.val().username)
                                    setP1Img(snapshot.val().profile_img)
                                    // setP1uid(data[room].owner)
                                } else {
                                    console.log("No data available");
                                }
                            }).catch((error) => {
                                console.error(error);
                            });

                            get(child(dbRef, `UserList/${data[room].challenger}`)).then((snapshot) => {
                                if (snapshot.exists()) {
                                    setP2Username(snapshot.val().username)
                                    setP2Img(snapshot.val().profile_img)
                                    // setP2uid(data[room].challenger)
                                } else {
                                    console.log("No data available");
                                }
                            }).catch((error) => {
                                console.error(error);
                            });

                            let counter = 5
                            const interval = setInterval(() => {
                                // console.log(counter);
                                setCenterText(counter)
                                counter--;

                                if (counter == 0) {
                                    clearInterval(interval);
                                    const db = getDatabase();
                                    let id1 = data[room]['owner']
                                    let id2 = data[room]['challenger']
                                    update(ref(db, `Matching/${room}/player`), {
                                        player1: id1,
                                        player2: id2
                                    });
                                    update(ref(db, `Matching/${room}/score`), {
                                        [id1]: 0,
                                        [id2]: 0
                                    });
                                    setCurrentUid('remove')
                                    remove(ref(db, `waitingRoom/${room}`));
                                    router.push(`/tictactoe?match=${room}`)
                                }
                            }, 1000);

                            if (key == 'owner' && intend == 'custom') {
                                // if เปนเจ้าของห้อง กดพร้อมได้
                                setShowReady(true)
                            }
                            else {

                            }

                        }
                    })
                });
            }
        });
    }

    // const startGame = () => {
    //     const db = getDatabase();
    //     update(ref(db, `Matching/${roomStart}/player`), {
    //         player1: p1uid,
    //         player2: p2uid
    //     });
    //     remove(ref(db, `waitingRoom/${roomStart}`));
    //     router.push(`/tictactoe?match=${roomStart}`)
    // }


    // del
    // const readUser = (uid: string) => {
    //     const userListref = ref(db, `UserList/${uid}`);
    //     onValue(userListref, (snapshot: any) => {
    //         const data = snapshot.val();
    //         setP1Img(data.profile_img)
    //         setP1Username(data.username)
    //         // console.log(data)
    //     });
    // }

    const userListRef = ref(db, `UserList`);
    const emailAuth = session?.data?.user?.email;

    interface User {
        email: string;
        profile_img: string;
        username: string;
        score: number;
        match: number;
        win: number;
    }

    const readData = (data: Record<string, unknown>) => {
        Object.keys(data).forEach((key) => {
            let obj = data[key] as User
            if (p1username == "Loading..." && obj.email === emailAuth) {
                setCurrentUid(key)
                setP1Username(obj.username)
                setP1Img(obj.profile_img)
            }
        });
    }

    onValue(userListRef, (snapshot: any) => {
        const data = snapshot.val();
        readData(data)
    });

    // }, [])

    // const createWaitingRoom = () => {
    //     if (currentUid != 'remove') {
    //     const db = getDatabase();
    //     set(ref(db, `waitingRoom/${currentUid}`), {
    //         owner: `${currentUid}`
    //     });
    //     return;
    // }
    // };

    const findWaitingRoom = async () => {
        console.log("Finding")
        const waitingRoomRef = ref(db, `waitingRoom`);
        const rooms = await (await get(waitingRoomRef)).val()
        // onValue(waitingRoomRef, (snapshot: any) => {
        //     rooms = snapshot.val();
        // });

        console.log('all rooms : ', rooms)
        if (rooms) {
            for (const [roomid, info] of Object.entries(rooms)) {
                if (typeof info == 'object' && info != null) {
                    if (intend == roomid && !(info as any).challenger) {
                        // console.log('hiie')
                        const db = getDatabase();
                        update(ref(db, `waitingRoom/${roomid}`), {
                            challenger: `${currentUid}`
                        });
                        setRoomId(roomid)
                        return;
                    }
                    else if (!(info as any).challenger && (info as any).owner != currentUid && !roomid.includes('custom') && !intend.includes('custom')) {
                        const db = getDatabase();
                        update(ref(db, `waitingRoom/${roomid}`), {
                            challenger: `${currentUid}`
                        });
                        setRoomId(roomid)
                        return;
                    }
                    else if ((info as any).owner == currentUid || (info as any).challenger == currentUid) {
                        setRoomId(roomid)
                        return;
                    }

                }
            }
            if (intend == 'custom' || intend == 'challenge') {
                let thisRoom = `${intend}-${uuidv4()}`
                setRoomId(thisRoom)
                set(ref(db, `waitingRoom/${thisRoom}`), {
                    owner: `${currentUid}`
                });
                return;
            }
            else {
                setStatus(`ไม่ใครอยู่เลย กำลังนำคุณกลับหน้าจอหลัก..`)
                setTimeout(() => {
                    router.push('/')
                }, 5000) 
            }

        } else {
            if (intend == 'custom' || intend == 'challenge') {
                let thisRoom = `${intend}-${uuidv4()}`
                setRoomId(thisRoom)
                set(ref(db, `waitingRoom/${thisRoom}`), {
                    owner: `${currentUid}`
                });
                return;
            }
            else {
    
                setStatus(`ไม่ใครอยู่เลย กำลังนำคุณกลับหน้าจอหลัก..`)
                setTimeout(() => {
                    router.push('/')
                }, 1000)  
                
            }

        }
    };

    useEffect(() => {
        console.log(currentUid)
        if (currentUid && currentUid != 'remove') {
            const countdown = setTimeout(() => {
                console.log('waiting...')
                findWaitingRoom()
                updateDataU()
                console.log('finding another player...')
            }, 1000)
            return () => clearTimeout(countdown);
        }
    }, [currentUid])


    const removeCurrent = async () => {

        const RoomRef = ref(db, `waitingRoom`);
        const invitingRef = ref(db, `inviting`);
        let rooms = null;
        let invites = null
        console.log("Exit")
        await setCurrentUid('remove')
        await onValue(RoomRef, (snapshot: any) => {
            rooms = snapshot.val();
        });
        console.log(rooms);
        await onValue(invitingRef, (snapshot: any) => {
            invites = snapshot.val();
        });
        if (invites) {
            console.log("removeCurrent")
            for (const [detination, value] of Object.entries(invites)) {
                if ((value as any)?.inviter == currentUid) {
                    remove(ref(db, `inviting/${detination}`));
                }
            }
        }
        if (rooms) {
            console.log("removeCurrent")
            for (const [roomId, value] of Object.entries(rooms)) {
                const owner = (value as any)?.owner;
                const challenger = (value as any)?.challenger;
                if (owner == currentUid) {
                    console.log("System must remove this room as owner");
                    if (!challenger) {
                        remove(ref(db, `waitingRoom/${roomId}`));
                    } else {
                        update(ref(db, `waitingRoom/${roomId}`), {
                            owner: `${challenger}`
                        });
                    }
                    remove(ref(db, `waitingRoom/${roomId}/challenger`));
                    router.push('/');
                    return;
                }
                if (challenger == currentUid) {
                    console.log("System must remove this room as challenger");
                    remove(ref(db, `waitingRoom/${roomId}/challenger`));
                    router.push('/');
                    return;
                }
            }
            // return;
        }
    }


    return (
        <>
            {roomId ?
                <div className="min-h-screen relative overflow-hidden flex flex-col">
                    <Background />
                    {showReady ?
                        // <div className="absolute h-full w-full flex z-20 bg-[#0005]">
                        //     <div className=" m-auto bg-white ring-2 ring-black p-10 rounded-lg grid gap-8">
                        //         <div className="text-center text-xl">พร้อมมั้ย ?</div>
                        //         <div className="grid grid-cols-2 gap-8">
                        //             <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                        //                 onClick={() => { }}>พร้อม</button>
                        //             <button className="ring-2 ring-black rounded-lg bg-white py-2 px-6"
                        //                 onClick={() => { }}>ไม่พร้อม</button>

                        //         </div>
                        //     </div>
                        // </div> 
                        ''
                        : ''
                    }
                    <div className="container px-4 relative mx-auto">
                        <button type="button" id='button' className="mt-12 px-3 py-1 bg-white ring-1 ring-black rounded-md" onClick={() => { removeCurrent() }}>
                            <div className="flex">
                                <span className="w-3 my-auto mr-2"><ImageComp path="/image/icon/back.svg" /></span>
                                ย้อนกลับ</div>
                        </button>
                    </div>

                    <div className="container px-4 relative mx-auto my-auto">

                        <div id="content" className="grid md:grid-cols-12 gap-8">
                            <div id="player1" className="w-3/5 mx-auto md:col-span-5">
                                <ImageComp path={p1img} />
                                <div className="text-center text-3xl mt-3">{p1username}</div>
                            </div>
                            <div id="vs" className="text-5xl text-center md:col-span-2 my-auto font-semibold">
                                {centerText}
                            </div>
                            <div id="player2" className="w-3/5 mx-auto md:col-span-5">
                                <ImageComp path={p2img} />
                                {intend == 'custom' && !showReady ? <Invitation props={{ currentUid, roomId }} /> : <div className="text-center text-3xl mt-3">{p2username}</div>}
                            </div>
                        </div>
                    </div>

                </div>
                :
                <div className="h-screen w-full flex justify-center items-center">
                    <div className="p-4 text-4xl">{status}</div>
                    <span className=""><ImageComp path={'/image/icon/Spinner-0.8s-200px.gif'} /></span>
                </div>
            }
        </>
    )
}

export default Waiting