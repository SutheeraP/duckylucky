import Image from "next/image"
import { useEffect } from "react"

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

const Board = (props:any) => {
    const { xTurn, won, draw, boardData, result, setXTurn, setWon, setDraw, setBoardData, setResult, reset , gameStatus} = props;

    useEffect(() => {
        checkWinner()
        checkDraw()
    },[boardData])

    const updateBoardData = (idx: number) => {
        if (!boardData[idx] && !won){
            let value = xTurn === true ? `/image/icon1.svg` : `/image/icon2.svg`;
            // console.log(idx + ':' + value);
            setBoardData(idx, value)
            setXTurn()
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
            }
            setResult(!xTurn? 'คุณชนะ !':'คุณแพ้ !')
        })
    }

    return(
        <div className="grid grid-cols-4 grid-rows-4 gap-2 self-center">
            {[...Array(16)].map((v, idx: number) => {
                return <div key={idx} className="w-20 h-20 cursor-pointer relative flex justify-center" onClick={gameStatus == 'mark'? () => {updateBoardData(idx)} : undefined}>
                    <div className="self-center text-2xl">
                        <Image className={boardData[idx] == `` ? `hidden`:`block`} src={boardData[idx]} alt=""  width={50} height={50}/>
                    </div>
                    <Image src={`/image/board/grid${idx+1}.svg`} alt=""  width={80} height={80} className="absolute top-0 left-0"/>
                </div>
            })}
        </div>
    )
}

export default Board;