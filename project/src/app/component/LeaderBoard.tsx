import React, { useEffect } from 'react'
import { useState } from "react";
import { getDatabase, ref, set, onValue, update, remove, child, get, push } from "firebase/database";

const LeaderBoard = (uid: any) => {
    const db = getDatabase();
    const userRef = ref(db, `UserList`);


    interface User {
        email: string;
        profile_img: string;
        username: string;
        score: number;
        match: number;
        win: number;
    }

    interface weight {
        matches: Number,
        scores: Number,
        wins: Number
    }

    interface ranks {
        [key: string]: any;
    }
    const weights = { matches: 0.2, scores: 0.6, wins: 0.2 } as weight
    const [Board, setBoard] = useState<ranks>()

    const CalcurateRanks = (matches: any, scores: any, wins: any, weights: any) => {

        const overall_score = (weights['matches'] * matches) + (weights['scores'] * scores) + (weights['wins'] * wins)

        return overall_score
    }
    const PrepareBoard = async () => {
        let preBoard = []
        const data = await (await get(userRef)).val() as User
        if (data) {
            for (const [Uid, info] of Object.entries(data)) {
                preBoard.push([Uid, info.username, CalcurateRanks(info.match, info.score, info.win, weights),info.match, info.score, info.win])
            }
            preBoard.sort(function (a, b) {
                return b[2] - a[2];
            });
            setBoard(preBoard)
            console.log(Board)
            return
        }
        
    }

    useEffect(() => {
        if (uid) {
            PrepareBoard()
            
        }
    }, [uid])

    return (
        <>
        {Board ?
        <>
        {Board.forEach((e:any)=>{
            return <div key={e[0]}>{`${e[1]}${e[4]}`}</div>
        })}
        </>
        :
        <>
        <div className="f-full text-center h-36 text-3xl bg-black text-white p-6 ">เป็ดดีเด่น...</div>
        </>
        
        }
        </>
    )
}

export default LeaderBoard