import Image from "next/image"
import { useEffect } from "react"
import { ref, update } from "firebase/database";

const WINNING_COMBO = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12]
]

const Board = (props: any) => {
    const { xTurn, won, draw, boardData, result, setXTurn, setWon, setDraw, setBoardData, setResult, reset, 
        gameStatus, selectedCard, x, o, currentUid, player, updateBoard, roomId, db, blinding, resetBoard, 
        swapXO, increaseActionPoint, bombRandomBoard, building, imgX, imgO, myScore} = props;

    useEffect(() => {
        checkWinner()
        checkDraw()
    }, [boardData])

    const updateBoardData = async(idx: number) => {
        if (xTurn && x == currentUid || !xTurn && o == currentUid) {
            let value = xTurn === true ? imgX : imgO;
            if (boardData[idx] != imgO && boardData[idx] != imgX && !won){

                //เพิ่ม local แล้วเชคก่อน
                boardData[idx] = value
                await checkWinner()
                await checkDraw()

                // บวกแต้มลงช่องพิเศษ
                if (boardData[idx].includes('display')) {
                    update(ref(db, `Matching/${roomId}/score`), {
                        [currentUid]: myScore + 200
                    })
                }

                if (boardData[idx]){
                    console.log('check value of board ', boardData[idx])
                    // resetBoard()
                    // swapXO()
                    increaseActionPoint()
                    // bombRandomBoard()
                    // building()
                    // console.log('check value of board ', boardData[idx])
                    // console.log('use boardFX')
                }
                update(ref(db, `Matching/${roomId}/board`), {
                    [idx]: value
                })
                update(ref(db, `Matching/${roomId}`), {
                    currentTurn: !xTurn
                })
                update(ref(db, `Matching/${roomId}`), {
                    time: 20
                })
                // if (boardData[idx]){
                //     console.log('check value of board ', boardData[idx])
                //     // resetBoard()
                //     // swapXO()
                //     increaseActionPoint()
                //     // bombRandomBoard()
                //     // building()
                //     // console.log('check value of board ', boardData[idx])
                //     // console.log('use boardFX')
                // }
            }
        }
    }

    const checkDraw = async() => {
        let check = Object.keys(boardData).every((v) => boardData[v])
        if(check){
            update(ref(db, `Matching/${roomId}`), {
                winner: 'draw'
            })
        }
        // setDraw(check)
    }

    const checkWinner = async() => {
        WINNING_COMBO.map((bd) => {
            const [a, b, c, d] = bd
            if (boardData[a] && boardData[a] == boardData[b] && boardData[b] == boardData[c] && boardData[c] == boardData[d]) {
                update(ref(db, `Matching/${roomId}`), {
                    winner: currentUid
                })
                return
            }
            setResult(!xTurn ? 'คุณชนะ !' : 'คุณแพ้ !')
        })
    }

    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-2 self-center ">
            {[...Array(16)].map((v, idx: number) => {
                return <div key={idx} className={`${selectedCard === `` ? 'w-20 h-20' : 'w-12 h-12'} cursor-pointer relative flex justify-center`} onClick={gameStatus == 'Playing' ? () => { updateBoardData(idx) } : undefined}>
                    <div className="self-center text-2xl">
                        {/* ไม่มีข้อมูลมั้ย */}
                        <Image className={`${boardData[idx] == `` ? `hidden` : `block`} 
                        ${(x == currentUid && boardData[idx] == imgX) || (o == currentUid && boardData[idx] == imgO) ? `greyscale-0`:`grayscale`}`} 
                        
                        src={`${blinding? (boardData[idx].includes('display') ? boardData[idx] : '/image/icon/waitP2.svg') : boardData[idx]}`} 
                        alt="" 
                        width={selectedCard === `` ? 50 : 30} 
                        height={selectedCard === `` ? 50 : 30} />
                    </div>
                    <Image src={`/image/board/grid${idx + 1}.svg`} alt="" width={80} height={80} className="absolute top-0 left-0" />
                </div>
            })}
        </div>
    )
}

export default Board;