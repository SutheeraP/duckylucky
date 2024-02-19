'use client'

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getDatabase, ref, set, onValue, update, remove, child, get } from "firebase/database";
import { db } from "@/app/firebase";
import { useEffect } from "react";
import { useState } from "react";


const Invitation = (prop: any) => {
    const { props } = prop
    const [userInfo, setUserInfo] = useState<string>()

    const user = async () => {
        const userListRef = ref(db, `UserList`);
        const user = (await get(userListRef)).val()
        if (user) {
            console.log(user)
            setUserInfo(user)
        }
    }

    useEffect(() => {
        if (props['currentUid']) {
            user()
            console.log()

        }
    }, [props['currentUid']])

    const inviteUser = () => {
        const invite = (document.getElementById('invite-username') as HTMLInputElement)?.value

        if (userInfo) {
            for (const uid of Object.entries(userInfo)) {
                if (typeof uid[1] === 'object') {
                    console.log(typeof uid[1] && uid[1])
                    if (uid[1]['username'] == invite && uid[0] != props['currentUid']) {
                        console.log('eiei')
                        const db = getDatabase();
                        update(ref(db, `inviting/${uid[0]}`), {
                            inviter: props['currentUid'],
                            roomId: props['roomId']
                        })
                    }
                }
            }
        }
    }

    return (
        <>
            <input type="text" id='invite-username' />
            <button type="submit" id='btn-invite' onClick={() => { inviteUser() }}>submit</button>
        </>
    )
}

export default Invitation