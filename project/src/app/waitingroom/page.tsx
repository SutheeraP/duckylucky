'use client'

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getDatabase, ref, set, onValue, update, remove } from "firebase/database";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { updateCurrentUser } from "firebase/auth";
import { async } from "@firebase/util";



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
    const updateData = async () => {
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
        if (email) {
            const uid = await getUserUid(email);
            if (uid != null) {
                readUser(uid)
            }

        }
        updateData()
    };

    fetchUserData();

    // }, [])

    const createWaitingRoom = () => {
        const db = getDatabase();
        set(ref(db, `waitingRoom/owner:${currentUid}`), {
            owner: `${currentUid}`
        });

    };

    const findWaitingRoom = async () => {
        const waitingRoomRef = ref(db, `waitingRoom`);

        await onValue(waitingRoomRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((key) => {
                    // console.log('key : ', data[key].email)
                    if (Object.keys(data[key]).length == 1 && data[key].owner != currentUid) {
                        console.log(data[key])
                        const db = getDatabase();
                        update(ref(db, `waitingRoom/${key}`), {
                            challenger: `${currentUid}`
                        });

                        return;
                    }
                    else if (data[key].owner == currentUid) {
                        console.log('you are owner now')
                        return;
                    }
                    else {
                        updateData()
                        return;
                    }

                });
                return;
            }
            else {
                console.log('Room not found, will turn you into owner')
                createWaitingRoom()
                return;
            }
        });
    };

    const removeCurrent = async () => {
        const userListRef = ref(db, `waitingRoom`);
        await onValue(userListRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((room) => {
                    Object.keys(data[room]).forEach((key) => {
                        switch (key) {
                            case 'owner':
                                if (data[room][key] === currentUid) {
                                    remove(ref(db, `waitingRoom/${room}/${key}`))
                                    router.push('/')
                                    return;
                                }
                                break;
                            case 'challenger':
                                if (data[room][key] === currentUid) {
                                    remove(ref(db, `waitingRoom/${room}/${key}`))
                                    router.push('/')
                                    return;
                                }
                                break;

                            default:
                                break;
                        }

                    })
                });
                return;
            }
        });
        
    }


    useEffect(() => {

        console.log(currentUid)
        if (currentUid) {
            console.log('waiting...')
            findWaitingRoom()
            console.log('finding another player...')
        }
    }, [currentUid])

    return (
        <>
            <h1>hii</h1>
            <button onClick={removeCurrent}>back</button>
        </>
    )
}

export default Waiting