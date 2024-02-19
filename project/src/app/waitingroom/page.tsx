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
    const [p1username, setP1Username] = useState("Loading...");
    const [p1img, setP1Img] = useState("/image/icon1.svg");
    const [p2username, setP2Username] = useState("waiting...");
    const [p2img, setP2Img] = useState("/image/icon/waitP2.svg");
    const router = useRouter()
    const intend = prop['searchParams']['intend']
    const [currentUid, setCurrentUid] = useState<any>()
    const [roomId, setRoomId] = useState<any>()
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
                    console.log(Object.keys(data[room]).length)
                    Object.keys(data[room]).forEach((key) => {
                        if (Object.keys(data[room]).length == 2 && data[room][key] === currentUid) {
                            if (key == 'owner' && intend == 'custom') {
                                //นี่จ่ะ ทำให้มันขึ้นกดเริ่มเกม เฉพาะโอนเนอในโหมดสร้างห้องเท่านั้น
                                //ให้ owner กด ready เต้าอัน
                            }
                            else {
                                const db = getDatabase();
                                update(ref(db, `Matching/${room}/player`), {
                                    player1: data[room]['owner'],
                                    player2: data[room]['challenger']
                                });
                                remove(ref(db, `waitingRoom/${room}`));
                                router.push(`/tictactoe?match=${room}`)
                            }
                        }
                    })
                });
            }
        });
    }
    const readUser = (uid: string) => {
        const userListref = ref(db, `UserList/${uid}`);
        onValue(userListref, (snapshot: any) => {
            const data = snapshot.val();
            setP1Img(data.profile_img)
            setP1Username(data.username)
            // console.log(data)
        });
    }

    const getUserUid = async (email: any) => {
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
        setCurrentUid(uid)
        return uid;
    };

    const fetchUserData = async () => {
        const email = session?.data?.user?.email;
        if (currentUid == undefined) {
            const uid = await getUserUid(email);
            if (uid != null) {
                readUser(uid)
            }

        }

    };

    fetchUserData();

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
        const rooms = (await get(waitingRoomRef)).val()
        // onValue(waitingRoomRef, (snapshot: any) => {
        //     rooms = snapshot.val();
        // });

        console.log(rooms)
        if (rooms) {
            for (const [roomId, info] of Object.entries(rooms)) {

                if (typeof info == 'object' && info != null) {
                    if (intend == roomId && !(info as any).challenger) {
                        // console.log('hiie')
                        const db = getDatabase();
                        update(ref(db, `waitingRoom/${roomId}`), {
                            challenger: `${currentUid}`
                        });
                        setRoomId(roomId)
                        return;
                    }
                    else if (!(info as any).challenger && (info as any).owner != currentUid && !roomId.includes('custom') && intend != 'custom') {
                        const db = getDatabase();
                        update(ref(db, `waitingRoom/${roomId}`), {
                            challenger: `${currentUid}`
                        });
                        setRoomId(roomId)
                        return;
                    }
                    else if ((info as any).owner == currentUid || (info as any).challenger == currentUid) {
                        setRoomId(roomId)
                        return;
                    }
                }
            }
            set(ref(db, `waitingRoom/${intend}-${uuidv4()}`), {
                owner: `${currentUid}`
            });
            setRoomId(roomId)
            return;
        } else {
            set(ref(db, `waitingRoom/${intend}-${uuidv4()}`), {
                owner: `${currentUid}`
            });
            setRoomId(roomId)
            return;
        }

    };

    useEffect(() => {

        console.log(currentUid)
        if (currentUid && currentUid != 'remove') {
            console.log('waiting...')
            findWaitingRoom()
            updateDataU()
            console.log('finding another player...')
        }
    }, [currentUid])


    const removeCurrent = async () => {

        const RoomRef = ref(db, `waitingRoom`);
        const invitingRef = ref(db, `inviting`);
        let rooms = null;
        let invites = null
        console.log("Exit")
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
            <div className="min-h-screen relative overflow-hidden flex flex-col">
                <Background />
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
                            VS
                        </div>
                        <div id="player2" className="w-3/5 mx-auto md:col-span-5">
                            <ImageComp path={p2img} />
                            {intend == 'custom' ? <Invitation props={{ currentUid, roomId }} /> : <div className="text-center text-3xl mt-3">{p2username}</div>}
                        </div>

                    </div>


                    {<button>ready?</button>}
                </div>

            </div>


        </>
    )
}

export default Waiting