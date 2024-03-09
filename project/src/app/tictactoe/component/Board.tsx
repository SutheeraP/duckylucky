import Image from "next/image"
import { useEffect } from "react"
import { ref, update, get, remove } from "firebase/database";

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
        swapXO, increaseActionPoint, bombRandomBoard, building, imgX, imgO, myScore, enemyId, enemyScore,
        effectOnBoard, boardFX, cancelBoard, setCancelBoard } = props;

    const updateBoardData = async (idx: number) => {
        if (xTurn && x == currentUid || !xTurn && o == currentUid) {
            let value = xTurn === true ? imgX : imgO;

            if (boardData[idx] != imgO && boardData[idx] != imgX && !won) {
                // ลงช่องพิเศษ + 200
                if (boardData[idx].includes('display') && !cancelBoard) {
                    // ไม่ใช้การ์ดป้องกัน ทำงานตามบอด
                    console.log('in special')
                    update(ref(db, `Matching/${roomId}/score`), {
                        [currentUid]: myScore + 200
                    })


                    // เรียก boardFX จาก listindex ตัวที่ 0 ซึ่งเก็บ index ที่จะใช้เรียก boardFX
                    let effect = boardFX[effectOnBoard[0]]

                    // ก็อบ listindex ที่จะเอาไปใช้เรียก boardFX มาแล้ว ตัดตัวหน้าออก
                    let cuteffect = [...effectOnBoard]
                    cuteffect.shift()

                    // update ทับใน db
                    if (cuteffect) {
                        update(ref(db, `Matching/${roomId}`), {
                            effectonboard: cuteffect
                        })
                    }
                    else {
                        remove(ref(db, `Matching/${roomId}/effectonboard`))
                    }


                    // สั่ง notify ด้วย id
                    update(ref(db, `Matching/${roomId}/notify/${currentUid}`), {
                        boardFX: effect.id
                    })
                    update(ref(db, `Matching/${roomId}/notify/${enemyId}`), {
                        boardFX: effect.id
                    })

                    console.log(effect)
                    // เช็คว่าเป็น FX อะไร จาก id ของ effect
                    if (effect.id == '1') {
                        console.log('พายุ')
                        resetBoard()
                    }
                    if (effect.id == '2') {
                        console.log('เกรซ')
                        swapXO()
                    }
                    if (effect.id == '3') {
                        console.log('ราชินี')
                        increaseActionPoint()
                    }
                    if (effect.id == '4') {
                        console.log('ระเบิด')
                        bombRandomBoard()
                    }
                }
                else {
                    // ธรรมดา +20
                    update(ref(db, `Matching/${roomId}/score`), {
                        [currentUid]: myScore + 20
                    })
                    // ล้าง cancel board
                    setCancelBoard(false)
                }

                //เพิ่ม local แล้วเชคก่อน
                boardData[idx] = value
                await checkWinner()
                await checkDraw()

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

    const userRef = ref(db, `UserList`);
    const scoreRef = ref(db, `Matching/${roomId}/score`);
    const playerRef = ref(db, `Matching/${roomId}/player`);
    let idList = [currentUid, enemyId]
    const checkDraw = async () => {
        let check = Object.keys(boardData).every((v) => boardData[v])
        if (check) {
            update(ref(db, `Matching/${roomId}`), {
                winner: 'draw'
            })

            //  บวกฝั่งละ 500
            const data = (await get(userRef)).val()
            const dataScore = (await get(scoreRef)).val()
            idList.forEach(id => {
                if (data[id]) {
                    let oldScore = dataScore[id]
                    update(ref(db, `Matching/${roomId}/score`), {
                        [id]: oldScore + 500,
                    })
                }
            })

            updateUserData()
        }
    }

    const checkWinner = async () => {
        WINNING_COMBO.map((bd) => {
            const [a, b, c, d] = bd
            if (boardData[a] && boardData[a] == boardData[b] && boardData[b] == boardData[c] && boardData[c] == boardData[d]) {
                update(ref(db, `Matching/${roomId}/score`), {
                    [currentUid]: myScore + 1000
                })
                update(ref(db, `Matching/${roomId}`), {
                    winner: currentUid
                })
                updateUserData()
                updateWin()
                return
            }
        })
    }

    const updateUserData = async () => {
        // update score game เข้า database ทั้ง 2 ผุ้เล่น
        const data = (await get(userRef)).val()
        const dataScore = (await get(scoreRef)).val()
        if (data) {
            idList.forEach(id => {
                if (data[id]) {
                    let newScore = dataScore[id]
                    let oldScore = data[id]['score']
                    let oldMatch = data[id]['match']

                    update(ref(db, `UserList/${id}`), {
                        score: oldScore + newScore,
                        match: oldMatch + 1
                    })

                }
            })
        }
    }

    const updateWin = async () => {
        // update จำนวนชนะตัวเอง
        const data = (await get(userRef)).val()
        if (data) {
            if (data[currentUid]) {
                let oldWin = data[currentUid]['win']
                update(ref(db, `UserList/${currentUid}`), {
                    win: oldWin + 1
                })
            }
        }
    }



    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-2 self-center ">
            {[...Array(16)].map((v, idx: number) => {
                return <div key={idx} className={`${selectedCard === `` ? 'w-20 h-20' : 'w-12 h-12'} cursor-pointer relative flex justify-center`} onClick={gameStatus == 'Playing' ? () => { updateBoardData(idx) } : undefined}>
                    <div className="self-center text-2xl">
                        {/* ไม่มีข้อมูลมั้ย */}
                        <Image className={`${boardData[idx] == `` ? `hidden` : `block`} 
                        ${(x == currentUid && boardData[idx] != imgO) || (o == currentUid && boardData[idx] != imgX) ? `greyscale-0` : `grayscale`}`}

                            src={`${blinding ? (boardData[idx].includes('display') ? boardData[idx] : '/image/icon/waitP2.svg') : boardData[idx]}`}
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