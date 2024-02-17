"use client";
import Image from "next/image"
import Board from "./component/Board";
import Card from "./component/Card";

import { useEffect, useState } from "react"
import { Result } from "postcss";

// const WINNING_COMBO = [
//     [0,1,2,3],
//     [4,5,6,7],
//     [8,9,10,11],
//     [12,13,14,15],
//     [0,4,8,12],
//     [1,5,9,13],
//     [2,6,10,14],
//     [3,7,11,15],
//     [0,5,10,15],
//     [3,6,9,12]
// ]

export default function TicTacToe() {

    const [xTurn, setXTurn] = useState(true);
    const [won, setWon] = useState(false)
    const [draw, setDraw] = useState(false)
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

    const [result, setResult] = useState("")

    const setXTurnbyBoard = () => {
        setXTurn(!xTurn)
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

    // useEffect(() => {
    //     checkWinner()
    //     checkDraw()
    // },[boardData])

    // const updateBoardData = (idx: number) => {
    //     if (!boardData[idx] && !won){
    //         let value = xTurn === true ? `/image/icon1.svg` : `/image/icon2.svg`;
    //         console.log(idx + ':' + value);
    //         setBoardData({...boardData, [idx]: value});
    //         setXTurn(!xTurn)
    //     }
    //     checkWinner() 
    // }

    // const checkDraw = () => {
    //     let check = Object.keys(boardData).every((v) => boardData[v])
    //     setDraw(check)
    // }

    // const checkWinner = () => {
    //     WINNING_COMBO.map((bd) => {
    //         const [a,b,c,d] = bd
    //         if (boardData[a] && boardData[a] == boardData[b] && boardData[b] == boardData[c] && boardData[c] == boardData[d]){
    //             setWon(true)
    //             return
    //             // console.log(won)
    //         }
    //         setResult(!xTurn? 'คุณชนะ !':'คุณแพ้ !')
    //     })
    // }

    // const resetBoard = () => {
    //     setBoardData({
    //         0:``,
    //         1:``, 
    //         2:``, 
    //         3:``, 
    //         4:``, 
    //         5:``, 
    //         6:``, 
    //         7:``, 
    //         8:``, 
    //         9:``, 
    //         10:``, 
    //         11:``, 
    //         12:``, 
    //         13:``, 
    //         14:``, 
    //         15:``
    //     })
    //     setXTurn(true)
    //     setWon(false)
    //     setDraw(false)

    

    return(
        <div className='sm:container mx-auto'>
            <div className='container-sm sm:mx-auto'>
                <div className="flex flex-col justify-center items-center h-screen gap-6">
                    <div id="enemyCard" className="bg-slate-300 w-screen h-56 flex-none">01</div>
                    {/* <div className="flex-grow flex align-middle">
                        <div className="grid grid-cols-4 grid-rows-4 gap-2 self-center">
                            {[...Array(16)].map((v, idx: number) => {
                                return <div key={idx} className=" w-20 h-20 cursor-pointer relative flex justify-center" onClick={() => {updateBoardData(idx)}}>
                                    <div className="self-center text-2xl">
                                        <Image className={boardData[idx] == `` ? `hidden`:`block`} src={boardData[idx]} alt=""  width={50} height={50}/>
                                    </div>
                                    <Image src={`/image/grid${idx+1}.svg`} alt=""  width={80} height={80} className="absolute top-0 left-0"/>
                                </div>
                            })}
                        </div>
                    </div> */}
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
                            reset = { resetbyBoard }/>

                    <div id="userCard" className="bg-slate-300 w-screen h-56 flex-none">
                        <Card/>
                    </div>
                </div>
                <div className="flex flex-row justify-center gap-4">
                    {/* <div className="bg-slate-300 rounded-lg flex w-28 p-2 justify-center items-center cursor-pointer" onClick={() => {resetBoard()}}>reset board</div>
                    <div className="bg-slate-300 rounded-lg flex w-28 p-2 justify-center items-center cursor-pointer">insert card</div>
                    <div className="bg-slate-300 rounded-lg flex w-28 p-2 justify-center items-center cursor-pointer">remove card</div> */}
                </div>
            </div>

            <div className={` bg-black bg-opacity-50 w-full h-screen absolute top-0 flex flex-col justify-center items-center ${(won || draw) ? 'flex' : 'hidden'}`}>
                <div className="text-white font-bold text-3xl">{draw? 'เสมอ' : !xTurn? 'คุณชนะ !':'คุณแพ้ !'}</div>
                <Image src="/image/icon1.svg" alt="" width={250} height={250}/>
                <div className={`flex flex-row ${draw || xTurn? 'gap-28 translate-y-12' : 'gap-20 translate-y-4'} absolute`}>
                    <Image src={draw || xTurn? '/image/lose_Lwing.svg' : '/image/win_Lwing.svg'} alt=""  width={160} height={160}/>    
                    <Image src={draw || xTurn? '/image/lose_Rwing.svg' : '/image/win_Rwing.svg'} alt=""  width={160} height={160}/>
                </div>
                <div className="flex flex-col justify-center text-center transform -translate-y-8">
                        <div className="bg-black text-white font-bold text-xl rounded-xl w-40 h-auto flex justify-center p-1 ">DavisS</div>
                        <div className="text-white transform">543 คะแนน</div>  
                </div>
                
                <div className="bg-white text-black rounded-md w-40 flex justify-center items-center p-2 mt-10 border-solid border-2 border-black">กลับหน้าหลัก</div>
            </div>
        </div>
    )
}