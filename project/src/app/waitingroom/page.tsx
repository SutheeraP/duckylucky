'use client'

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { updateCurrentUser } from "firebase/auth";
import { async } from "@firebase/util";



const Waiting = () => {

    const [currentUid, setCurrentUid] = useState<any>()
    const [waitingRoom, setWaitingRoom] = useState()
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin');
        },
    })
    // useEffect(() => {
    // console.log('HiHi')
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
        if (waitingRoom) {
            updateData()
        }
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
                        setWaitingRoom(data[key])
                        return;
                    }
                    else if (data[key].owner == currentUid) {
                        console.log('you are owner now')
                        setWaitingRoom(data[key])
                        return;
                    }
                    else{
                        console.log('bug')
                        
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

    const updateData = async () => {
        const userListRef = ref(db, `waitingRoom`);

        await onValue(userListRef, (snapshot: any) => {
            const data = snapshot.val();
            Object.keys(data).forEach((key) => {
                if (data[key] === waitingRoom && data[key].length == 2) {

                    return;
                }
            });
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
        </>
    )
}

export default Waiting