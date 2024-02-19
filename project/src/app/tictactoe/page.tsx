"use client";
import Image from "next/image"
import Board from "./component/Board";
import CardLayout from "./component/CardLayout";
import ModalCard from "./component/MadalCard";

import { useState } from "react"

export default function TicTacToe() {
    const [gameStatus, setGameStatus] = useState<any>('start')
    // usecard
    // mark
    // console.log(gameStatus)

    const [xTurn, setXTurn] = useState(true)
    const [won, setWon] = useState(false)
    const [draw, setDraw] = useState(false)
    const [result, setResult] = useState("")
    interface BoardData {
        [key: string]: any;
    }
    const [boardData, setBoardData] = useState<BoardData>({
        0:``,
        1:``, 
        2:``, 
        3:``, 
        4:``, 
        5:``, 
        6:``, 
        7:``, 
        8:``, 
        9:``, 
        10:``, 
        11:``, 
        12:``, 
        13:``, 
        14:``, 
        15:``
    });

    const setXTurnbyBoard = () => {
        setXTurn(!xTurn)
        setGameStatus('start')
    }

    const resetbyBoard = () => {
        setXTurn(true)
        setBoardData({
            0:``,
            1:``, 
            2:``, 
            3:``, 
            4:``, 
            5:``, 
            6:``, 
            7:``, 
            8:``, 
            9:``, 
            10:``, 
            11:``, 
            12:``, 
            13:``, 
            14:``, 
            15:``
        })
        setWon(false)
        setDraw(false)
    }

    const setWonbyBoard = (bool:boolean) =>{
        setWon(bool)
    }

    const setDrawbyBoard = (bool:boolean) =>{
        setDraw(bool)
    }

    const setBoardDatabyBoard = (idx:number, value:any) => {
        setBoardData({...boardData, [idx]: value});
    }

    const setResultbyBoard = (string:string) => {
        setResult(string);
    }

    const card = [
        {id:1, name:'การ์ดนางฟ้า', point:0, img:'/image/card/card1.svg', description:'สามารถป้องกันเอ็ฟเฟ็กส์ด้านลบ หรือการ์ดสกิลที่ฝั่งตรงข้ามใช้ใส่เราได้ โดยจะเป็นช่วงให้ใช้ทันทีที่ฝั่งตรงข้ามใช้สกิลใส่เรา'},
        {id:2, name:'ฉันขอปฏิเสธ', point:1, img:'/image/card/card2.svg', description:'สามารถปฏิเสธผลกระทบที่เกิดขึ้นทั้งหมด'},
        {id:3, name:'วาจาประกาศิต', point:2, img:'/image/card/card3.svg', description:'สั่งผู้เล่นฝ่ายตรงข้ามสุ่มทิ้งการ์ด 1 ใบในมือ'},
        {id:4, name:'หัวขโมย', point:2, img:'/image/card/card4.svg', description:'สามารถขโมยการ์ดจากฝั่งตรงข้ามได้ 1 ใบแบบสุ่ม'},
        {id:5, name:'คำสาปของแม่มดน้ำเงิน', point:2, img:'/image/card/card5.svg', description:'สามารถใช้เพื่อห้ามฝั่งตรงข้ามให้ไม่สามารถใช้สกิลใดได้ 1 รอบ'},
        {id:6, name:'จงตาบอดไปซะ', point:4, img:'/image/card/card6.svg', description:'สามารถใช้เพื่อให้รอบถัดไปของฝั่งตรงข้ามไม่สามารถเห็นได้ว่าสัญลักษณ์แต่ละช่องเป็นอะไร จะเห็นได้แค่ว่าช่องไหนกาได้ ช่องไหนกาไม่ได้ 1รอบ'}
    ]
    type CardType = any
    const [inhandCard, setInhandCard] = useState<CardType[]>([]);

    const randomCard = () => { return Math.floor(Math.random() * 6)}

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
    }

    // interface SelectedCard {
    //     [key: string]: any;
    // }
    // const [selectedCard, setSelectedCard] = useState<SelectedCard>({});
    // console.log(selectedCard)
    const [selectedCard, setSelectedCard] = useState<any>(``);
    // console.log(selectedCard)

    const setSelectedCardbyCardLayout = (index:number) => {
        setSelectedCard(index)
        // console.log(selectedCard)
    }

    return(
        <div className='container'>
            <div className='container-sm sm:mx-auto'>
                <div className="flex flex-col justify-center items-center h-screen gap-6">
                    <div id="enemyCard" className={`bg-slate-300 w-screen flex-none  ${!(selectedCard === ``)? 'h-32':'h-48'}`}>01</div>

                    <div className="flex-grow flex flex-col align-middle gap-4 justify-evenly">
                        <Board  xTurn = { xTurn } 
                                won = { won } 
                                draw = { draw } 
                                boardData = { boardData }  
                                result = { result }
                                setXTurn = { setXTurnbyBoard }
                                setWon = { setWonbyBoard }
                                setDraw = { setDrawbyBoard } 
                                setBoardData = { setBoardDatabyBoard }
                                setResult = { setResultbyBoard }
                                reset = { resetbyBoard }
                                gameStatus = { gameStatus }/>
                        
                        <div>
                            <ModalCard  selectedCard = { selectedCard }
                                        inhandCard = { [...inhandCard] }/>
                        </div>

                        <div className={`flex justify-between ${gameStatus == 'start'? 'block':'hidden'}`}>
                            <div className={`bg-black text-white rounded-lg flex w-40 p-2 justify-center items-center cursor-pointer ${inhandCard.length >= 5? 'pointer-events-none opacity-50':''}`} onClick={drawTwoCard}>จั่วการ์ด 2 ใบ</div>
                            <div className="bg-black text-white rounded-lg flex w-40 p-2 justify-center items-center cursor-pointer" onClick={() => {setGameStatus('usecard');}}>ใช้การ์ดและกา</div>
                        </div>
                        <div className={`flex ${!(selectedCard === ``)? 'justify-center':'justify-between'} ${gameStatus == 'usecard'? 'block':'hidden'}`}>
                            <div className={`bg-black text-white rounded-lg flex w-40 p-2 justify-center items-center cursor-pointer ${!(selectedCard === ``)? 'block':'hidden'}`} onClick={() => removeCard()}>ใช้การ์ด</div>
                            <div className={`bg-black text-white rounded-lg flex w-40 p-2 justify-center items-center cursor-pointer`} onClick={() => setGameStatus('mark')}>จบการใช้การ์ด</div>
                        </div>
                        <div className={`flex justify-center ${gameStatus == 'mark'? 'block':'hidden'}`}>
                            <div className={` text-black p-2`}>กาสัญลักษณ์</div>
                        </div>
                    </div>

                    <div id="userCard" className={`bg-slate-300 w-screen flex-none ${!(selectedCard === ``)? 'h-32':'h-48'}`}>
                        <CardLayout card = { [...card] }
                                    inhandCard = { [...inhandCard] }
                                    selectedCard = { selectedCard }
                                    setSelectedCard = { setSelectedCardbyCardLayout }/>
                    </div>
                </div>
            </div>

            <div className={` bg-black bg-opacity-50 w-full h-screen absolute top-0 flex flex-col justify-center items-center ${(won || draw) ? 'flex' : 'hidden'}`}>
                <div className="text-white font-bold text-3xl">{draw? 'เสมอ' : !xTurn? 'คุณชนะ !':'คุณแพ้ !'}</div>
                <Image src="/image/icon1.svg" alt="" width={200} height={200}/>
                <div className={`flex flex-row ${draw || xTurn? 'gap-28 translate-y-6' : 'gap-28 -translate-y-2'} absolute`}>
                    <Image src={draw || xTurn? '/image/lose_Lwing.svg' : '/image/win_Lwing.svg'} alt=""  width={120} height={120}/>    
                    <Image src={draw || xTurn? '/image/lose_Rwing.svg' : '/image/win_Rwing.svg'} alt=""  width={120} height={120}/>
                </div>
                <div className="flex flex-col justify-center text-center transform -translate-y-8">
                        <div className="bg-black text-white font-bold text-md rounded-xl w-40 h-auto flex justify-center p-1 ">DavisS</div>
                        <div className="text-white text-sm transform">543 คะแนน</div>  
                </div>
                <div className="bg-white text-black text-sm rounded-md w-36 flex justify-center items-center p-2 mt-10 border-solid border-2 border-black" onClick={resetbyBoard}>กลับหน้าหลัก</div>
            </div>
        </div>
    )
}