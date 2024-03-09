import React, { useEffect } from 'react'
import { useState } from "react";
import { getDatabase, ref, set, onValue, update, remove, child, get, push } from "firebase/database";
import ImageComp from './ImageComp';

const LeaderBoard = (uid: any) => {
    let seq = 3
    const db = getDatabase();
    const userRef = ref(db, `UserList`);
    const take = (arr: any, n = 1) => arr.slice(0, n);
    const takeRight = (arr: any, n = 1) => arr.slice(-n);

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
                preBoard.push([Uid, info.username, CalcurateRanks(info.match, info.score, info.win, weights), info.match, info.score, info.win, info.profile_img])
            }
            preBoard.sort(function (a, b) {
                return b[2] - a[2];
            });
            setBoard(take(preBoard, 10))

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
                    <div className="f-full text-center text-3xl relative pb-6">
                        <div className='bg-black w-full h-44 z-0 absolute'></div>
                        <div className='relative text-white pt-6'>เป็ดดีเด่น...</div>
                        <div className='flex gap-20 justify-between px-10 pt-6 text-2xl relative'>
                            <div className='pt-10'>
                                <ImageComp path={Board[1][6]} />
                                <div>{Board[1][1]}</div>
                                <div className='text-xl font-medium text-primary'>{Board[1][4].toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                            </div>
                            <div className=''>
                                <ImageComp path={Board[0][6]} />
                                <div>{Board[0][1]}</div>
                                <div className='text-xl font-medium text-primary'>{Board[0][4].toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                            </div>
                            <div className='pt-10'>
                                <ImageComp path={Board[2][6]} />
                                <div>{Board[2][1]}</div>
                                <div className='text-xl font-medium text-primary'>{Board[2][4].toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                            </div>
                        </div>
                    </div>
                    {
                        Board.slice(3, 10).map((e: any) => {
                            seq++
                            return  <div className='flex w-full justify-between px-20 py-3 gap-20 text-xl font-medium' >
                                        <div className='text-grayFX'>{seq}</div>
                                        <div className='flex-1'>{e[1]}</div>
                                        <div className='text-primary'>{e[4].toLocaleString(undefined, {maximumFractionDigits:2})}</div>

                                    </div>
                        })}
                </>
                :
                <>

                    <div className="f-full text-center text-3xl relative">
                        <div className='bg-black w-full h-32 z-0 absolute'></div>
                        <div className='relative text-white pt-6'>เป็ดดีเด่น...</div>
                        <div className='flex gap-20 justify-between px-10 pt-6 text-2xl relative'>
                            <div className='pt-10'>
                                <ImageComp path={'/image/icon4.svg'} />
                                <div>DavisS</div>
                                <div className='text-xl font-medium text-primary'>1000</div>
                            </div>
                            <div className=''>
                                <ImageComp path={'/image/icon4.svg'} />
                                <div>DavisS</div>
                                <div className='text-xl font-medium text-primary'>1000</div>
                            </div>
                            <div className='pt-10'>
                                <ImageComp path={'/image/icon4.svg'} />
                                <div>DavisS</div>
                                <div className='text-xl font-medium text-primary'>1000</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex w-full justify-between px-20 py-3 gap-20 text-xl font-medium' >
                        <div className='text-grayFX'>{seq}</div>
                        <div className='flex-1'>eiei</div>
                        <div className='text-primary'>2000</div>

                    </div>
                    <div className='flex w-full justify-between px-20 py-3 gap-20 text-xl font-medium' >
                        <div className='text-grayFX'>{seq}</div>
                        <div className='flex-1'>eiei</div>
                        <div className='text-primary'>2000</div>

                    </div>
                    <div className='flex w-full justify-between px-20 py-3 gap-20 text-xl font-medium' >
                        <div className='text-grayFX'>{seq}</div>
                        <div className='flex-1'>eiei</div>
                        <div className='text-primary'>2000</div>

                    </div>
                    <div className='flex w-full justify-between px-20 py-3 gap-20 text-xl font-medium' >
                        <div className='text-grayFX'>{seq}</div>
                        <div className='flex-1'>eiei</div>
                        <div className='text-primary'>2000</div>

                    </div>
                    <div className='flex w-full justify-between px-20 py-3 gap-20 text-xl font-medium' >
                        <div className='text-grayFX'>{seq}</div>
                        <div className='flex-1'>eiei</div>
                        <div className='text-primary'>2000</div>

                    </div>
                    <div className='flex w-full justify-between px-20 py-3 gap-20 text-xl font-medium' >
                        <div className='text-grayFX'>{seq}</div>
                        <div className='flex-1'>eiei</div>
                        <div className='text-primary'>2000</div>

                    </div>

                </>

            }
        </>
    )
}

export default LeaderBoard