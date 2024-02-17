'use client'

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getDatabase, ref, set, onValue, update, remove, child, get } from "firebase/database";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { updateCurrentUser } from "firebase/auth";
import { async } from "@firebase/util";
import {v4 as uuidv4} from 'uuid'; 



const Waiting = () => {
    const router = useRouter()
    const [currentUid, setCurrentUid] = useState<any>()
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin');
        },
    })
    // useEffect(() => {
    // console.log('HiHi')
    const updateDataU = async () => {
        const userListRef = ref(db, `waitingRoom`);

        await onValue(userListRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((room) => {
                    Object.keys(data[room]).forEach((key) => {
                        switch (key) {
                            case 'owner':
                                if (data[room][key] === currentUid) {
                                    console.log('you are Player 1')
                                }
                                break;
                            case 'challenger':
                                if (data[room][key] === currentUid) {
                                    console.log('you are Player 2')
                                }
                                break;

                            default:
                                break;
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
            // console.log(data)
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
        updateDataU()
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
                if (!info.challenger && info.owner != currentUid) {
                    const db = getDatabase();
                    update(ref(db, `waitingRoom/${roomId}`), {
                        challenger: `${currentUid}`
                    });
                    return;
                }
            }
            set(ref(db, `waitingRoom/${uuidv4()}`), {
                owner: `${currentUid}`
            });
            return;
        } else {
            set(ref(db, `waitingRoom/${uuidv4()}`), {
                owner: `${currentUid}`
            });
            return;
        }


        // else {
        //     console.log('Room not found, will turn you into owner')
        //     set(ref(db, `waitingRoom/${currentUid}`), {
        //         owner: `${currentUid}`
        //     });
        //     return;
        // }
        // if (currentUid != 'remove') {
        //     const waitingRoomRef = ref(db, `waitingRoom`);
        //     onValue(waitingRoomRef, (snapshot: any) => {
        //         const data = snapshot.val();
        //         console.log(data)
        //         console.log('eiei')
        //         console.log(currentUid)
        // if (data && currentUid != 'remove') {
        //     Object.keys(data).forEach((key) => {
        //         // console.log('key : ', data[key].email)
        //         if (Object.keys(data[key]).length == 1 && data[key].owner != currentUid) {
        //             console.log(data[key])
        //             const db = getDatabase();
        //             update(ref(db, `waitingRoom/${key}`), {
        //                 challenger: `${currentUid}`
        //             });


        //         }
        //         else if (data[key].owner == currentUid) {
        //             console.log('you are owner now')

        //         }

        //     });
        //     return;
        // }
        // else if(currentUid != 'remove') {
        //     console.log('Room not found, will turn you into owner')
        //     set(ref(db, `waitingRoom/${currentUid}`), {
        //         owner: `${currentUid}`
        //     });
        //     return;
        // }
        // });
    };




    useEffect(() => {

        console.log(currentUid)
        if (currentUid && currentUid != 'remove') {
            console.log('waiting...')
            findWaitingRoom()
            console.log('finding another player...')
        }
    }, [currentUid])


    const removeCurrent = async () => {

        const RoomRef = ref(db, `waitingRoom`);
        let rooms = null;
        console.log("Exit")
        await onValue(RoomRef, (snapshot: any) => {
            rooms = snapshot.val();
        });
        console.log(rooms);
        if (rooms) {
            console.log("removeCurrent")
            for (const [roomId, value] of Object.entries(rooms)) {
                const owner = value?.owner;
                const challenger = value?.challenger;
                if (owner == currentUid) {
                    console.log("System must remove this room as owner");
                    if (!challenger) {
                        remove(ref(db,`waitingRoom/${roomId}`));
                    } else {
                        update(ref(db, `waitingRoom/${roomId}`), {
                            owner: `${challenger}`
                        });
                    }
                    remove(ref(db,`waitingRoom/${roomId}/challenger`));
                    router.push('/');
                    return;
                }
                if (challenger == currentUid) {
                    console.log("System must remove this room as challenger");
                    remove(ref(db,`waitingRoom/${roomId}/challenger`));
                    router.push('/');
                    return;
                }
            }
            return;
        }
    }

    return (
        <>
            <h1>hii</h1>
            <button type="button" id='button' onClick={() => { removeCurrent() }}>back</button>
        </>
    )
}

export default Waiting