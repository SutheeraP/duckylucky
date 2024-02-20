"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getDatabase, ref, set, onValue, update, remove, child, get, push } from "firebase/database";
import { db } from "../firebase";
import Image from "next/image"
import Board from "./component/Board";
import CardLayout from "./component/CardLayout";
import ModalCard from "./component/MadalCard";
import { v4 as uuidv4 } from 'uuid';


import { useState, useEffect } from "react"
import Background from "../component/Background";

export default function TicTacToe(params: any) {

    const router = useRouter()
    const [roomId, setRoomId] = useState(params['searchParams']['match'])

    const [gameStatus, setGameStatus] = useState<any>('start')
    // start : เฟสแรกที่เลือกระหว่าง จั่ว2การ์ด กับ ใช้การ์ดและกา
    // usecard : เฟสต่อเมื่อเลือก ใช้การ์ดและกา เป็นเฟสให้ใช้สกิล
    // mark : เฟสต่อจากใช้สกิล กาสัญลักษณ์

    const [timeLeft, setTimeLeft] = useState(20);

    const [xTurn, setXTurn] = useState(true)
    const [won, setWon] = useState(false)
    const [draw, setDraw] = useState(false)
    const [result, setResult] = useState("")
    interface BoardData {
        [key: string]: any;
    }
    const [boardData, setBoardData] = useState<BoardData>({
        0: ``,
        1: ``,
        2: ``,
        3: ``,
        4: ``,
        5: ``,
        6: ``,
        7: ``,
        8: ``,
        9: ``,
        10: ``,
        11: ``,
        12: ``,
        13: ``,
        14: ``,
        15: ``
    });

    const setXTurnbyBoard = () => {
        setXTurn(!xTurn)
        setGameStatus('start')
        setPoint(5)
        setTimeLeft(20)
    }

    const resetbyBoard = () => {
        setXTurn(true)
        setBoardData({
            0: ``,
            1: ``,
            2: ``,
            3: ``,
            4: ``,
            5: ``,
            6: ``,
            7: ``,
            8: ``,
            9: ``,
            10: ``,
            11: ``,
            12: ``,
            13: ``,
            14: ``,
            15: ``
        })
        setWon(false)
        setDraw(false)
    }

    const setWonbyBoard = (bool: boolean) => {
        setWon(bool)
    }

    const setDrawbyBoard = (bool: boolean) => {
        setDraw(bool)
    }

    const setBoardDatabyBoard = (idx: number, value: any) => {
        setBoardData({ ...boardData, [idx]: value });
    }

    const setResultbyBoard = (string: string) => {
        setResult(string);
    }

    const card = [
        { id: 1, name: 'การ์ดนางฟ้า', point: 0, img: '/image/card/card1.svg', description: 'ป้องกันเอ็ฟเฟ็กส์ด้านลบ หรือการ์ดสกิลที่ฝั่งตรงข้ามใช้ใส่เราได้ โดยจะเป็นช่วงให้ใช้ทันทีที่ฝั่งตรงข้ามใช้สกิลใส่เรา' },
        { id: 2, name: 'ฉันขอปฏิเสธ', point: 1, img: '/image/card/card2.svg', description: 'ปฏิเสธผลกระทบที่เกิดขึ้นทั้งหมด' },
        { id: 3, name: 'วาจาประกาศิต', point: 2, img: '/image/card/card3.svg', description: 'สั่งผู้เล่นฝ่ายตรงข้ามสุ่มทิ้งการ์ด 1 ใบในมือ' },
        { id: 4, name: 'หัวขโมย', point: 2, img: '/image/card/card4.svg', description: 'ขโมยการ์ดจากฝั่งตรงข้าม 1 ใบแบบสุ่ม' },
        { id: 5, name: 'คำสาปของแม่มดน้ำเงิน', point: 2, img: '/image/card/card5.svg', description: 'ห้ามฝั่งตรงข้ามไม่ให้ใช้สกิลใดได้ 1 รอบ' },
        { id: 6, name: 'จงตาบอดไปซะ', point: 4, img: '/image/card/card6.svg', description: 'ทำให้ฝั่งตรงข้ามมองไม่เห็นสัญลักษณ์ว่าเป็นของใคร เห็นแค่ช่องไหนกาได้หรือไม่ได้ 1 รอบ' }
    ]
    type CardType = any
    const [inhandCard, setInhandCard] = useState<CardType[]>([]);

    const randomCard = () => { return Math.floor(Math.random() * 6) }
    // random เลข 0-5 เพื่อเอาไปดึง card มาใส่ใน inhandcard

    const drawTwoCard = () => {
        const card1 = randomCard();
        const card2 = randomCard();
        setInhandCard([...inhandCard, card[card1], card[card2]]);
        setXTurn(!xTurn)
    }

    const removeCard = () => {
        setInhandCard(prevArray => {
            return prevArray.filter((_, index) => index !== selectedCard);
        });
        resetSelectedCard()
    }

    const [selectedCard, setSelectedCard] = useState<any>(``);

    const setSelectedCardbyCardLayout = (index: number) => {
        setSelectedCard(index)
        if (point >= inhandCard[index].point) { setUseable(true) }
        else { setUseable(false) }
    }

    const resetSelectedCard = () => {
        setSelectedCard(``)
    }

    const [maxPoint, setMaxPoint] = useState<number>(5)
    const [point, setPoint] = useState<number>(maxPoint)
    const [useable, setUseable] = useState<boolean>(true)
    // maxpoint ใช้ตอนช่องพิเศษบัญชาจากราชินีหงส์ (+2point next round)
    // useable ใช้ตอนทำคำสาปแม่มดน้ำเงิน (ห้ามใช้สกิล)

    const checkUseCard = () => {
        if (point >= inhandCard[selectedCard].point) {
            setPoint(point - inhandCard[selectedCard].point)
            removeCard()
            console.log('used card')
        }
    }
    // useCard เป็น filter เวลาใช้สกิล เอาไว้เช็คว่าเป็นสกิลอะไรด้วย

    // fix error ห้ามใช้ useCard ใน callback function
    // const handleUseCard = () => {
    //     setGameStatus('usecard');
    //   };


    useEffect(() => {
        const countdown = setTimeout(() => {
            if (timeLeft === 0) {
                // setXTurnbyBoard()
            } else {
                setTimeLeft(timeLeft - 1);
            }
        }, 1000);
        update(ref(db, `Matching/${roomId}`), {
            board: boardData
        })
        update(ref(db, `Matching/${roomId}`), {
            time: timeLeft
        })
        return () => clearTimeout(countdown);
    }, [xTurn, timeLeft]);




    const updateBoard = async () => {
        const MatchRef = ref(db, `Matching/${roomId}`);
        const match = (await get(MatchRef)).val()

        // console.log(match['board'])
        if (match && match['board'] != boardData) {
            setBoardData(match['board'])
        }


    }

    updateBoard()

    // useEffect(() => {
    //     const db = getDatabase();
    //     if(){

    //     });
    //     updateBoard()
    //     }


    // }, [boardData])

    const btnClass = 'bg-black text-white rounded-lg ring-1 flex w-40 p-2 justify-center items-center cursor-pointer hover:bg-white hover:text-black hover:scale-105 hover:ring-black'

    return (
        <div className='relative overflow-hidden'>
            <Background />
            <div className='container mx-auto relative z-10'>
                <div id="time&point_sm" className="md:hidden flex absolute top-14 inset-x-2/4 -translate-x-34 w-72 h-24 items-center">
                    <div className="w-24 h-24 border border-black bg-white rounded-full flex justify-center items-center text-4xl z-10">
                        {timeLeft}
                    </div>
                    <div className="w-48 h-16 pl-12 bg-white border -translate-x-8 border-black flex flex-col gap-1 rounded-lg justify-center">
                        <div>
                            {xTurn ? 'X Player' : 'O player'}
                        </div>
                        <div className="flex gap-1">
                            {[...Array(point)].map((v, idx: number) => {
                                return <div key={uuidv4()}>
                                    <Image src={'/image/point_full.svg'} alt="" width={16} height={16}></Image>
                                </div>
                            })}
                            {[...Array(maxPoint - point)].map((v, idx: number) => {
                                return <div key={uuidv4()}>
                                    <Image src={'/image/point_empty.svg'} alt="" width={16} height={16}></Image>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div id="time&point_md" className="hidden md:flex absolute w-fit h-full">
                    <div className="my-auto flex items-center">
                        <div className="w-24 h-24 border border-black bg-white rounded-full flex justify-center items-center text-4xl z-10">
                            {timeLeft}
                        </div>
                        <div className="w-48 h-16 pl-12 bg-white border -translate-x-8 border-black flex flex-col gap-1 rounded-lg justify-center">
                            <div>
                                {xTurn ? 'X Player' : 'O player'}
                            </div>
                            <div className="flex gap-1">
                                {[...Array(point)].map((v, idx: number) => {
                                    return <div key={uuidv4()}>
                                        <Image src={'/image/point_full.svg'} alt="" width={16} height={16}></Image>
                                    </div>
                                })}
                                {[...Array(maxPoint - point)].map((v, idx: number) => {
                                    return <div key={uuidv4()}>
                                        <Image src={'/image/point_empty.svg'} alt="" width={16} height={16}></Image>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center h-screen gap-4">
                    <div id="enemyCard" className={` w-screen flex-none  ${!(selectedCard === ``) ? 'h-40' : 'h-48'}`}>

                    </div>

                    <div className="flex-grow flex flex-col align-middle gap-4 justify-evenly max-w-full px-10">
                        <Board xTurn={xTurn}
                            won={won}
                            draw={draw}
                            boardData={boardData}
                            result={result}
                            setXTurn={setXTurnbyBoard}
                            setWon={setWonbyBoard}
                            setDraw={setDrawbyBoard}
                            setBoardData={setBoardDatabyBoard}
                            setResult={setResultbyBoard}
                            reset={resetbyBoard}
                            gameStatus={gameStatus}
                            selectedCard={selectedCard} />

                        <div className={`max-w-lg ${!(selectedCard === ``) ? 'block' : 'hidden'} `}>
                            <ModalCard selectedCard={selectedCard}
                                resetSelectedCard={resetSelectedCard}
                                inhandCard={[...inhandCard]} />
                        </div>

                        <div className={`flex justify-between ${gameStatus == 'start' ? 'block' : 'hidden'}`}>
                            <div className={`${btnClass} ${inhandCard.length >= 5 ? 'pointer-events-none opacity-50' : ''}`} onClick={drawTwoCard}>จั่วการ์ด 2 ใบ</div>
                            <div className={`${btnClass}`} onClick={() => { setGameStatus('usecard') }}>ใช้การ์ดและกา</div>
                        </div>
                        <div className={`flex ${!(selectedCard === ``) ? 'justify-between' : 'justify-center'} ${gameStatus == 'usecard' ? 'block' : 'hidden'}`}>
                            <div className={`${btnClass} ${!(selectedCard === ``) ? 'block' : 'hidden'} ${!useable ? 'pointer-events-none opacity-50' : ''}`} onClick={() => { checkUseCard() }}>ใช้การ์ด</div>
                            <div className={`${btnClass}`} onClick={() => { setGameStatus('mark') }}>จบการใช้การ์ด</div>
                        </div>
                        <div className={`flex justify-center ${gameStatus == 'mark' ? 'block' : 'hidden'}`}>
                            <div className={` text-black p-2`}>กาสัญลักษณ์</div>
                        </div>
                    </div>

                    <div id="userCard" className={` w-screen flex-none ${!(selectedCard === ``) ? 'h-40' : 'h-48'}`}>
                        <CardLayout card={[...card]}
                            inhandCard={[...inhandCard]}
                            selectedCard={selectedCard}
                            setSelectedCard={setSelectedCardbyCardLayout} />
                    </div>
                </div>
            </div>

            <div className={` bg-black bg-opacity-50 w-full z-30 h-screen absolute top-0 flex flex-col justify-center items-center ${(won || draw) ? 'flex' : 'hidden'}`}>
                <div className="text-white font-bold text-3xl">{draw ? 'เสมอ' : !xTurn ? 'คุณชนะ !' : 'คุณแพ้ !'}</div>
                <Image src="/image/icon1.svg" alt="" width={200} height={200} />
                <div className={`flex flex-row ${draw || xTurn ? 'gap-28 translate-y-6' : 'gap-28 -translate-y-2'} absolute`}>
                    <Image src={draw || xTurn ? '/image/lose_Lwing.svg' : '/image/win_Lwing.svg'} alt="" width={120} height={120} />
                    <Image src={draw || xTurn ? '/image/lose_Rwing.svg' : '/image/win_Rwing.svg'} alt="" width={120} height={120} />
                </div>
                <div className="flex flex-col justify-center text-center transform -translate-y-8">
                    <div className="bg-black text-white font-bold text-md rounded-xl w-40 h-auto flex justify-center p-1 ">DavisS</div>
                    <div className="text-white text-sm transform">543 คะแนน</div>
                </div>
                <div className="bg-white text-black text-sm rounded-md w-36 flex justify-center items-center p-2 mt-10 border-solid border-2 border-black" onClick={() => { router.push(`/`); resetbyBoard }}>กลับหน้าหลัก</div>
            </div>
        </div>
    )
}