import Board from "./component/board"
import Boardtest from "./component/Boardtest"
import A1 from '../image/gridA1'
"use client";
import { useEffect, useState } from "react"


const WINNING_COMBO = [
    [0,1,2,3],
    [4,5,6,7],
    [8,9,10,11],
    [12,13,14,15],
    [0,4,8,12],
    [1,5,9,13],
    [2,6,10,14],
    [3,7,11,15],
    [0,5,10,15],
    [3,6,9,12]
]

export default function TicTacToe() {

    const [xTurn, setXTurn] = useState(true);
    const [won, setWon] = useState(false)
    const [draw, setDraw] = useState(false)
    const [boardData, setBoardData] = useState({
        0:"",
        1:"", 
        2:"", 
        3:"", 
        4:"", 
        5:"", 
        6:"", 
        7:"", 
        8:"", 
        9:"", 
        10:"", 
        11:"", 
        12:"", 
        13:"", 
        14:"", 
        15:""
    });
    const [result, setResult] = useState("")
    const menuVariants = {
        open: {
          opacity: 1,
          x: 0,
        },  
        closed: {
          opacity: 0,
          x: '-100%',
        },
      }

    useEffect(() => {
        checkWinner()
        checkDraw()
    },[boardData])

    const updateBoardData = (idx) => {
        if (!boardData[idx] && !won){
            let value = xTurn === true ? 'X' : 'O';
            console.log(idx + ':' + value);
            setBoardData({...boardData, [idx]: value});
            setXTurn(!xTurn)
        }
        checkWinner()
    }

    const checkDraw = () => {
        let check = Object.keys(boardData).every((v) => boardData[v])
        setDraw(check)
    }

    const checkWinner = () => {
        WINNING_COMBO.map((bd) => {
            const [a,b,c,d] = bd
            if (boardData[a] && boardData[a] == boardData[b] && boardData[b] == boardData[c] && boardData[c] == boardData[d]){
                setWon(true)
                return
                // console.log(won)
            }
            setResult(!xTurn? 'คุณชนะ !':'คุณแพ้ !')
            console.log(boardData[a])
        })
    }

    const resetBoard = () => {
        setBoardData({
            0:"",
            1:"", 
            2:"", 
            3:"", 
            4:"", 
            5:"", 
            6:"", 
            7:"", 
            8:"", 
            9:"", 
            10:"", 
            11:"", 
            12:"", 
            13:"", 
            14:"", 
            15:""
        })
        setXTurn(true)
        setWon(false)
        setDraw(false)

    }

    return(
        <div>
            <head>
                <title>TicTacToe</title>
            </head>
            {/* <h1>TicTacToe</h1> */}
            <p>{`Game Won: ${won} Game Draw: ${draw}`}</p>
            <div className='container lg mx-auto'>
                <div className="flex flex-col justify-center items-center">
                    <div className="bg-slate-300">01</div>
                    {/* <Board/> */}
                    <div className="grid grid-cols-4 grid-rows-4 gap-2">
                        {[...Array(16)].map((v, idx) => {
                            return <div key={idx} className="bg-slate-300 w-20 h-20 cursor-pointer" onClick={() => {updateBoardData(idx)}}>
                                {boardData[idx]}
                            </div>
                        })}
                    </div>
                    {/* <Boardtest></Boardtest> */}
                    <div className="bg-slate-300">03</div>
                </div>
                <div className="flex flex-row justify-center gap-4">
                    <div className="bg-slate-300 rounded-lg flex w-28 p-2 justify-center items-center cursor-pointer" onClick={() => {resetBoard()}}>reset board</div>
                    <div className="bg-slate-300 rounded-lg flex w-28 p-2 justify-center items-center cursor-pointer">insert card</div>
                    <div className="bg-slate-300 rounded-lg flex w-28 p-2 justify-center items-center cursor-pointer">remove card</div>
                </div>
            </div>
            <div className=' bg-black bg-opacity-50 w-full h-screen absolute top-0 flex flex-col justify-center items-center'>
                <div className="text-white font-bold text-3xl">{result}</div>
                <div className="w-60 h-60 bg-white rounded-full"></div>
                <div className="bg-black text-white font-bold text-3xl rounded-xl w-40 flex justify-center items-center pb-2">x</div>
                <div className="text-white">543 คะแนน</div>
            </div>
        </div>
    )
}