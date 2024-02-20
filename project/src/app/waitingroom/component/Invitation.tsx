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
    const [isFound, setIsFound] = useState(false);

    const user = async () => {
        const userListRef = ref(db, `UserList`);
        const user = (await get(userListRef)).val()
        if (user) {
            console.log('[invite] all user info : ',user)
            setUserInfo(user)
        }
    }

    useEffect(() => {
        if (props['currentUid']) {
            user()
            // console.log()
        }
    }, [props['currentUid']])

    const inviteUser = () => {
        // console.log('click invite')
        // console.log('userinfo : ', user)
        const inviteWho = (document.getElementById('invite-username') as HTMLInputElement)?.value
        if (userInfo) {
            for (const uid of Object.entries(userInfo)) {
                if (typeof uid[1] === 'object') {
                    // console.log('userinfo in inviteUSer()',userInfo)
                    if (uid[1]['username'] == inviteWho && uid[0] != props['currentUid']) {
                        setIsFound(true)
                        console.log('player found | inviter : ', props['currentUid'],' | roomId : ', props['roomId'])
                        const db = getDatabase();
                        update(ref(db, `inviting/${uid[0]}`), {
                            inviter: props['currentUid'],
                            roomId: props['roomId'],
                        })
                    }
                }
            }
            // if(!isFound){
            //     console.log('player not found')
            // }
        }
    }

    return (
        <div className="my-4 flex flex-col gap-4">
            <input type="text" id='invite-username' className="ring-1 ring-black rounded-md p-2" placeholder="ชื่อผู้ใช้"/>
            <button type="submit" id='btn-invite' className="bg-black text-white rounded-md p-2" onClick={() => { inviteUser() }}>เชิญ</button>
        </div>
    )
}

export default Invitation