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
import { start } from "repl";

export default function TicTacToe(params: any) {
    // console.log('auto repage')
    const router = useRouter()
    const [roomId, setRoomId] = useState(params['searchParams']['match'])
    const [x, setX] = useState('');
    const [o, setO] = useState('');
    const [enemyId, setEnemyId] = useState('');
    let player = ''
    // x กับ o คือ ตัว user ที่มาเล่น
    const [currentUid, setCurrentUid] = useState<any>()

    const [gameStatus, setGameStatus] = useState<any>('Deciding')
    // start : เฟสแรกที่เลือกระหว่าง จั่ว2การ์ด กับ ใช้การ์ดและกา
    // play : เฟสเมื่อเือกใช้การ์ดหรือกา จะสามารถใช้การ์ดได้เรื่อยๆ และจะจบเทิร์นเมื่อกา

    // usecard : เฟสต่อเมื่อเลือก ใช้การ์ดและกา เป็นเฟสให้ใช้สกิล
    // mark : เฟสต่อจากใช้สกิล กาสัญลักษณ์

    const [timeLeft, setTimeLeft] = useState(20);

    const [xTurn, setXTurn] = useState(true)
    const [won, setWon] = useState(false)
    const [draw, setDraw] = useState(false)
    const [result, setResult] = useState("")

    // for card
    const [inhandCard, setInhandCard] = useState<CardType[]>([]);
    const [cardX, setCardX] = useState<CardType[]>([]);
    const [cardO, setCardO] = useState<CardType[]>([]);
    const [cardEnemy, setCardEnemy] = useState<CardType[]>([]);

    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin');
        },
    })

    const userListRef = ref(db, `UserList`);
    const emailAuth = session?.data?.user?.email;

    interface User {
        email: string;
        profile_img: string;
        username: string;
    }

    const readData = (data: Record<string, unknown>) => {
        Object.keys(data).forEach((key) => {
            let obj = data[key] as User
            if (!currentUid && obj.email === emailAuth) {
                setCurrentUid(key)
                // console.log(key)
            }
        });
    }

    onValue(userListRef, (snapshot: any) => {
        const data = snapshot.val();
        readData(data)
        player = data
    });

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

    // const setXTurnbyBoard = () => {
    //     // updateBoard()
    //     // console.log(boardData)
    //     // updateBoard()
    //     console.log('push turn')
    //     update(ref(db, `Matching/${roomId}`), {
    //         currentTurn: !xTurn
    // })
    // update(ref(db, `Matching/${roomId}`), {
    //     time: 20
    // })
    // setGameStatus('Deciding')
    // setPoint(5)

    // if (xTurn && x == currentUid) {
    //     update(ref(db, `Matching/${roomId}`), {
    //         currentTurn: !xTurn
    //     })
    //     update(ref(db, `Matching/${roomId}`), {
    //         time: 20
    //     })
    //     remove(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`));
    //     return
    // }
    // if (!xTurn && o == currentUid) {
    //     update(ref(db, `Matching/${roomId}`), {
    //         currentTurn: !xTurn
    //     })
    //     update(ref(db, `Matching/${roomId}`), {
    //         time: 20
    //     })
    //     remove(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`));
    //     return
    // }
    // }

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
        console.log(idx)
        console.log(value)
    }

    const setResultbyBoard = (string: string) => {
        setResult(string);
    }

    const card = [
        { id: 1, name: 'ป่อเป็ดตึ๊ง', point: 0, img: '/image/card/card1.svg', description: 'ป้องกันเอ็ฟเฟ็กส์ด้านลบ หรือการ์ดสกิลที่ฝั่งตรงข้ามใช้ใส่เราได้ โดยจะเป็นช่วงให้ใช้ทันทีที่ฝั่งตรงข้ามใช้สกิลใส่เรา' },
        { id: 2, name: 'ฉันขอปฏิเสธ', point: 1, img: '/image/card/card2.svg', description: 'ปฏิเสธผลกระทบที่เกิดขึ้นทั้งหมด' },
        { id: 3, name: 'วาจาประกาศิต', point: 2, img: '/image/card/card3.svg', description: 'สั่งผู้เล่นฝ่ายตรงข้ามสุ่มทิ้งการ์ด 1 ใบในมือ' },
        { id: 4, name: 'หัวขโมย', point: 2, img: '/image/card/card4.svg', description: 'ขโมยการ์ดจากฝั่งตรงข้าม 1 ใบแบบสุ่ม' },
        { id: 5, name: 'คำสาปของแม่มดน้ำเงิน', point: 2, img: '/image/card/card5.svg', description: 'ห้ามฝั่งตรงข้ามไม่ให้ใช้สกิลใดได้ 1 รอบ' },
        { id: 6, name: 'จงตาบอดไปซะ', point: 4, img: '/image/card/card6.svg', description: 'ทำให้ฝั่งตรงข้ามมองไม่เห็นสัญลักษณ์ว่าเป็นของใคร เห็นแค่ช่องไหนกาได้หรือไม่ได้ 1 รอบ' }
    ]
    type CardType = any

    const boardFX = [
        { id: 1, name: 'พายุร้อน', img: '/image/boardFX/boardFX1.svg', description: 'รีเซ็ตกระดาน' },
        { id: 2, name: 'ความช่วยเหลือของเกรซมิลเลอร์', img: '/image/boardFX/boardFX2.svg', description: 'สลับสัญลักษณ์ทั้งหมดบนกระดาน' },
        { id: 3, name: 'บัญชาจากราชีนีหงส์', img: '/image/boardFX/boardFX3.svg', description: 'เพิ่มค่าพลังการกระทำ 2 หน่วย ในตาถัดไป ให้กับผู้เล่นที่กาช่องนี้' },
        { id: 4, name: 'ของขวัญจากมือระเบิด', img: '/image/boardFX/boardFX4.svg', description: 'สุ่มเกิดการระเบิด 3 ช่อง หลังจากนั้นช่องนั้นๆ จะกลายเป็นช่องว่าง' },
        { id: 5, name: 'ธุรกิจของนายหน้า', img: '/image/boardFX/boardFX5.svg', description: 'ผู้เล่นที่ได้รับเอฟเฟคจะสามารถเลือก วางเขตก่อสร้างตรงไหนก็ได้จำนวน 2 ช่อง หรือ ยกเลิกได้' },
        { id: 6, name: 'ลิขิตของเดวิส', img: '/image/boardFX/boardFX6.svg', description: 'ได้รับการ์ดนางฟ้า 1 ใบ' }
    ]

    const displayFX = [
        '/image/boardFX/displayFX1.svg',
        '/image/boardFX/displayFX2.svg',
        '/image/boardFX/displayFX3.svg',
        '/image/boardFX/displayFX4.svg',
        '/image/boardFX/displayFX5.svg',
        '/image/boardFX/displayFX6.svg'
    ]

    const randomBoard = () => {
        let numbers = [];
        let numboard = [];
        for (let i = 0; i <= 15; i++) {
            numbers.push(i);
        }
        for (let i = 1; i <= 4; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            const randomNumber = numbers[randomIndex];
            numbers.splice(randomIndex, 1);
            numboard.push(randomNumber)
        }
        return numboard;
    }

    const randomDisplayFX = () => { 
        let numbers = [];
        let numFX = [];
        for (let i = 1; i <= 6; i++) {
            numbers.push(i);
        }
        for (let i = 1; i <= 4; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            const randomNumber = numbers[randomIndex];
            numbers.splice(randomIndex, 1);
            numFX.push(randomNumber)
        }
        return numFX;
    }

    const randomCard = () => { return Math.floor(Math.random() * 6) }
    // random เลข 0-5 เพื่อเอาไปดึง card มาใส่ใน inhandcard

    const drawTwoCard = async () => {
        // จั่ว 2 แล้วสั่่งจบเทิน
        const card1 = randomCard();
        const card2 = randomCard();
        // สุ่มมาเพิ่ม
        if (x == currentUid) {
            await addCard(card[card1], 'player1')
            await addCard(card[card2], 'player1')
        }
        else if (o == currentUid) {
            await addCard(card[card1], 'player2')
            await addCard(card[card2], 'player2')
        }
        // setInhandCard([...inhandCard, card[card1], card[card2]]);
        // setXTurn(!xTurn)
        update(ref(db, `Matching/${roomId}`), {
            currentTurn: !xTurn
        })
        update(ref(db, `Matching/${roomId}`), {
            time: 20
        })
        if (xTurn && x == currentUid) {
            remove(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`));
            return
        }
        if (!xTurn && o == currentUid) {
            remove(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`));
            return
        }
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
        // กดใช้แล้ว point พอ
        if (point >= inhandCard[selectedCard].point) {
            update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
                action: point - inhandCard[selectedCard].point
            })
            if (x == currentUid) {
                deleteCard(selectedCard, 'player1')
            }
            else if (o == currentUid) {
                deleteCard(selectedCard, 'player2')
            }
            setSelectedCard('')
        }
    }

    useEffect(() => {
        const countdown = setTimeout(() => {
            if (timeLeft === 0) {
                update(ref(db, `Matching/${roomId}`), {
                    currentTurn: !xTurn

                })

                update(ref(db, `Matching/${roomId}`), {
                    time: 20
                })
                if (!xTurn && x == currentUid) {
                    remove(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`));
                    return
                }
                if (xTurn && o == currentUid) {
                    remove(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`));
                    return
                }


            } else {
                update(ref(db, `Matching/${roomId}`), {
                    time: timeLeft - 1
                })
            }
        }, 1000);

        return () => clearTimeout(countdown);

    }, [xTurn, timeLeft]);

    const gameRef = ref(db, `Matching/${roomId}`);
    const cardRef = ref(db, `Matching/${roomId}/card`);
    const turnRef = ref(db, `Matching/${roomId}/currentTurn`);
    const timeRef = ref(db, `Matching/${roomId}/time`);
    const boardRef = ref(db, `Matching/${roomId}/board`);
    const effectRef = ref(db, `Matching/${roomId}/effect`);
    const actionRef = ref(db, `Matching/${roomId}/player`);

    // for check function


    // รวมดัก onvalue
    useEffect(() => {
        
        // if(x == currentUid){
        //     // console.log('')
        //     const numBoard = [...randomBoard()]
        //     console.log('numBoard is', numBoard)
        //     for (let board of numBoard){
        //         console.log('board is ',board)
        //         setBoardDatabyBoard(board, '/image/displayFX/displayFX1.svg')
        //         console.log('test board')
        //     }
        // }
        
        // get x และ o เซ็ตครั้งเดียว
        const getPlayer = async () => {
            const data = (await get(gameRef)).val()
            if (data) {
                setX(data['player']['player1'])
                setO(data['player']['player2'])
            }
            else {
                router.push('/')
            }

        }
        getPlayer()

        // board listener
        onValue(boardRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                setBoardData(data)
                // console.log('init board')
            }
            else {
                // สร้าง init Board เพื่อมา setup ช่องพิเศษตอนเริ่มเกม
                interface InitBoard {
                    [key: string]: any;
                }
                let initBoard = {
                    0:'',
                    1:'',
                    2:'',
                    3:'',
                    4:'',
                    5:'',
                    6:'',
                    7:'',
                    8:'',
                    9:'',
                    10:'',
                    11:'',
                    12:'',
                    13:'',
                    14:'',
                    15:''
                }

                // random ค่าเพื่อหา board ที่จะมี FX และ รูปของ FX ที่จะเอามาแสดงผลแบบสุ่ม
                const numBoard = [...randomBoard()]
                const numDisplay = [...randomDisplayFX()]

                // set ค่าของ initBoard ให้เป็นรูป FX ตามช่องที่สุ่มได้
                initBoard[numBoard[0].toString()] = `/image/displayFX/displayFX${numDisplay[0]}.svg`
                initBoard[numBoard[1].toString()] = `/image/displayFX/displayFX${numDisplay[1]}.svg`
                initBoard[numBoard[2].toString()] = `/image/displayFX/displayFX${numDisplay[2]}.svg`
                initBoard[numBoard[3].toString()] = `/image/displayFX/displayFX${numDisplay[3]}.svg`

                // เซ็ตเกมตอนไม่ครั้งแรกที่เล่น ด้วย initBoard
                update(ref(db, `Matching/${roomId}`), {
                    board: initBoard
                })

                // กำหนดเวลา 20
                update(ref(db, `Matching/${roomId}`), {
                    time: timeLeft
                })

                // เริ่มที่ x
                update(ref(db, `Matching/${roomId}`), {
                    currentTurn: true
                })

                // สร้าง action และ deciding
                update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
                    action: 5,
                    phrase: 'Deciding'
                })

                const cardX1 = randomCard();
                const cardX2 = randomCard();
                const cardO1 = randomCard();
                const cardO2 = randomCard();

                // สร้าง card สามใบแรก
                update(ref(db, `Matching/${roomId}/card`), {
                    player1: [card[0], card[cardX1], card[cardX2]],
                    player2: [card[0], card[cardO1], card[cardO2]]
                })
            }
        })

        // turn listener
        onValue(turnRef, (snapshot: any) => {
            const data = snapshot.val();

            // update player action
            update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
                action: 5,
                phrase: 'Deciding'
            })

            setXTurn(data) // update turn ในเกม
            updateEffectTurn() // update turn ในเอฟเฟคที่ทำงานอยู่
        })

        //time listener
        onValue(timeRef, (snapshot: any) => {
            const data = snapshot.val();
            setTimeLeft(data)
        })

        // card listener
        onValue(cardRef, (snapshot) => {
            // update all card when card change
            const data = snapshot.val();
            if (data) {
                if (data.player1) {
                    let card = data.player1 // ดึง card จาก DB
                    if (!Array.isArray(card)) {
                        card = Object.values(card) // แปลงเป็น array ให้ถ้ามีตัวเดียวหรืออ๊อง 
                    }
                    card = card.filter(Boolean) // กรองบัค empty card
                    setCardX(card)
                }
                else {
                    setCardX([])
                }

                if (data.player2) {
                    let card = data.player2 // ดึง card จาก DB
                    if (!Array.isArray(card)) {
                        card = Object.values(card) // แปลงเป็น array ให้ถ้ามีตัวเดียวหรืออ๊อง 
                    }
                    card = card.filter(Boolean) // กรองบัค empty card
                    setCardO(card)
                }
                else {
                    setCardO([])
                }
            }
            else {
                setCardX([])
                setCardO([])
            }

        });

        onValue(actionRef, (snapshot: any) => {
            const data = snapshot.val();
            // console.log('data action', data)
            if (data) {
                setGameStatus(data.PlayerActionInTurn.phrase)
                if (!data.PlayerActionInTurn.action) {
                    setPoint(0)
                }
                else {
                    setPoint(data.PlayerActionInTurn.action)
                }
            }
        })

        //effect listener
        onValue(effectRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                console.log('data effect found')

                //คำสาปแม่มด ห้ามใช้การ์ด
                if (data.blockCard) {
                    if (data.blockCard.turn == 2 && currentUid == data.blockCard.target) {
                        // ปรับ point เปน 0
                        update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
                            action: 0
                        })
                    }
                    if (data.blockCard.turn >= 3) {
                        remove(ref(db, `Matching/${roomId}/effect/blockCard`));
                    }
                }

                // จงตาบอด ไม่ให้ดูสัญลักษณ์
                if (data.blind) {
                    if (data.blind.turn >= 1 && currentUid == data.blind.target) {
                        console.log('update action 0')
                        update(ref(db, `Matching/${roomId}/effect/blind`), {
                            //ปรับบอดเป็นสัญลักดียวกันหมด
                        })
                    }
                    if (data.blind.turn >= 3) {
                        update(ref(db, `Matching/${roomId}/effect/blind`), {
                            //ให้กลับมาแสดงผล
                        })
                        remove(ref(db, `Matching/${roomId}/effect/blind`));
                    }
                }
            }

        })
    }, []); // มี uid แล้วรันครั้งแรก

    // update card ตามฝั่ง
    useEffect(() => {
        if (x == currentUid) {
            setInhandCard(cardX)
            setCardEnemy(cardO)
            setEnemyId(o)
        }
        if (o == currentUid) {
            setInhandCard(cardO)
            setCardEnemy(cardX)
            setEnemyId(x)
        }
    }, [cardX, cardO]);

    const addCard = async (card: Object, target: string) => {
        // ex. addcard(card[1], 'player1')
        // ps. player 1 = x, player2 = o

        const cardList = (await get(cardRef)).val()
        let newSet // เซ็ตอัพเดต
        if (cardList && cardList[target]) {
            let currentCards = cardList[target] // เก็บ card ปจบ ถ้ามี
            if (!Array.isArray(currentCards)) {
                currentCards = Object.values(currentCards)  // แปลงเป็น array ให้ถ้ามีตัวเดียวหรืออ๊อง 
            }
            currentCards = currentCards.filter(Boolean) // กรองบัค card empty
            newSet = [...currentCards, card] // เพิ่ม card
        }
        else {
            newSet = [card]
        }
        // console.log('newset : ', newSet)
        update(ref(db, `Matching/${roomId}/card`), {
            [target]: newSet
        })
    }

    const deleteCard = async (cardIndex: number, target: string) => {
        // ex. ลบกรา์ดที่กดใช้ = deleteCard(selectedCard, 'player1')
        // ex. ลบการ์ดตำแหน่ง 0 = deleteCard(0, 'player1')

        let newSet
        // splice ต้องทำกับตัวเองเท่านั้น
        if (target == 'player1') {
            newSet = [...cardX]; // ก็อปกองเก่า
            newSet.splice(cardIndex, 1) // ลบตาม index
        }
        else if (target == 'player2') {
            newSet = [...cardO];
            newSet.splice(cardIndex, 1)
        }
        update(ref(db, `Matching/${roomId}/card`), {
            [target]: newSet
        })

    }

    // การ์ดแม่มดน้ำเงิน
    const blockCard = async () => {
        update(ref(db, `Matching/${roomId}/effect/blockCard`), {
            turn: 1,
            target: enemyId
        })
    }

    // การ์ดจงตาบอด
    const blind = async () => {
        update(ref(db, `Matching/${roomId}/effect/blind`), {
            turn: 1,
            target: enemyId
        })
    }

    // ไว้ update turn ให้การ์ดที่ทำงานอยู่
    const updateEffectTurn = async () => {
        const data = (await get(effectRef)).val()
        if (data) {
            if (data.blockCard) {
                update(ref(db, `Matching/${roomId}/effect/blockCard`), {
                    turn: data.blockCard.turn + 1
                })
            }
            if (data.blind) {
                update(ref(db, `Matching/${roomId}/effect/blind`), {
                    turn: data.blind.turn + 1
                })
            }
        }

    }

    const updateBoard = async () => {
        update(ref(db, `Matching/${roomId}`), {
            board: boardData
        })
        update(ref(db, `Matching/${roomId}`), {
            currentTurn: !xTurn
        })
        update(ref(db, `Matching/${roomId}`), {
            time: 20
        })

    }

    // const updateBoard = async () => {
    //     // console.log(xTurn, x, currentUid)
    //     const MatchRef = ref(db, `Matching/${roomId}/board`);
    //     const match = (await get(MatchRef)).val()
    //     if (match) {
    //         for (let i = 0; i < 16; i++) {
    //             if (Object.values(match)[i] != Object.values(boardData)[i]) {
    //                 if (xTurn != undefined && currentUid != undefined) {

    //                     if (!xTurn && x == currentUid) {
    //                         update(ref(db, `Matching/${roomId}`), {
    //                             board: boardData
    //                         })
    //                     }
    //                     else if (xTurn && o == currentUid) {
    //                         update(ref(db, `Matching/${roomId}`), {
    //                             board: boardData
    //                         })
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    // const updateAction = async () => {

    //     const ActionRef = ref(db, `Matching/${roomId}/player`);
    //     await onValue(ActionRef, (snapshot: any) => {
    //         const data = snapshot.val();

    //         if (data) {
    //             if (data['PlayerActioninTurn']) {
    //                 if (data['PlayerActioninTurn']['phrase'] != gameStatus || data['PlayerActioninTurn']['action'] != point) {
    //                     if (xTurn && data['player1'] == currentUid) {
    //                         setPoint(data['PlayerActioninTurn']['action'])
    //                         setGameStatus(data['PlayerActioninTurn']['phrase'])
    //                         return
    //                     }
    //                     else if (!xTurn && data['player2'] == currentUid) {
    //                         setPoint(data['PlayerActioninTurn']['action'])
    //                         setGameStatus(data['PlayerActioninTurn']['phrase'])
    //                         return
    //                     }
    //                 }
    //             }
    //             else {

    //                 if (xTurn && data['player1'] == currentUid) {
    //                     // console.log('eiei')
    //                     update(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`), {

    //                         action: 5,
    //                         phrase: 'Deciding'
    //                     })
    //                     return
    //                 }
    //                 else if (!xTurn && data['player2'] == currentUid) {
    //                     update(ref(db, `Matching/${roomId}/player/PlayerActioninTurn`), {

    //                         action: 5,
    //                         phrase: 'Deciding'
    //                     })
    //                     return
    //                 }
    //             }
    //         }
    //     });
    // }
    // updateAction()

    const btnClass = 'bg-black text-white rounded-lg ring-1 flex w-40 p-2 justify-center items-center cursor-pointer hover:bg-white hover:text-black hover:scale-105 hover:ring-black'

    // const [boardHaveFX, setBoardHaveFX] = useState<number[]>([]);
    // let boardHaveFX : number[] = []
    // useEffect(() => {
    //     // if (xTurn && x == currentUid){
    //         console.log('randomboard is here ',randomBoard())
    //         setBoardHaveFX(randomBoard());
    //         console.log('boardHaveFX start here ', boardHaveFX)
    //     // }
    // }, [])

    // const multiplayerState = async () => {
    //     const waitingRef = ref(db, `Matching/${roomId}`);
    //     await onValue(waitingRef, (snapshot: any) => {
    //         const data = snapshot.val();

    //         if (data) {
    //             // let haveFX = false
    //             // if (data['board']){
    //             //     for (let i = 0 ; i < 16 ; i++){
    //             //         // console.log('board ', i, ' is ',Object.values(data['board'])[i])
    //             //         if (Object.values(data['board'])[i] != ''){
    //             //             haveFX = true
    //             //         }
    //             //     }
    //             //     if (!haveFX){
    //             //         // let boardFX = randomBoard()
    //             //         console.log('boardHaveFX is ', boardHaveFX)
    //             //     }
    //             //     else {

    //             //     }

    //             // }

    //             // const cardX = data.card.player1
    //             // console.log('cardX : ',cardX)
    //             x = (data['player']['player1'])
    //             o = (data['player']['player2'])


    //             if (data['board'] != undefined && data['currentTurn'] != undefined) {
    //                 if (data['time'] != timeLeft) {
    //                     setTimeLeft(data['time'])
    //                 }
    //                 if (data['currentTurn'] != xTurn) {
    //                     // console.log(data['currentTurn'], xTurn)
    //                     setXTurn(data['currentTurn'])
    //                 }
    //             }
    //             else {
    //                 // console.log(1)
    //                 // console.log(2)
    //                 // console.log(3)
    //                 // console.log(4)
    //                 // console.log(5)
    //                 // console.log(6)
    //                 // setBoardDatabyBoard(2, '/image/displayFX1.svg')
    //                 // setBoardDatabyBoard(3, '/image/displayFX1.svg')
    //                 // setBoardDatabyBoard(4, '/image/displayFX1.svg')
    //                 // setBoardDatabyBoard(5, '/image/displayFX1.svg')
    //                 // setBoardDatabyBoard(6, '/image/displayFX1.svg')
    //                 // setBoardDatabyBoard(7, '/image/displayFX1.svg')
    //                 // setBoardDatabyBoard(8, '/image/displayFX1.svg')
    //                 // console.log(boardData)
    //                 // setBoardDatabyBoard(9, '/image/displayFX1.svg')
    //                 // ตรงนี้ทำครั้งเดียวแน่ ๆ 
    //                 // console.log('initiate board')
    //                 // if (xTurn && x == currentUid){
    //                 //     let boardHaveFX:number[] = [...randomBoard()]
    //                 //     for (let board of boardHaveFX){
    //                 //         console.log('board is ', board)
    //                 //         setBoardDatabyBoard(board, '/image/displayFX1.svg' );
    //                 //         console.log(boardData)
    //                 //     }
    //                 // }

    //                 update(ref(db, `Matching/${roomId}`), {
    //                     board: boardData
    //                 })
    //                 update(ref(db, `Matching/${roomId}`), {
    //                     time: timeLeft
    //                 })
    //                 update(ref(db, `Matching/${roomId}`), {
    //                     currentTurn: true
    //                 })

    //                 const cardX1 = randomCard();
    //                 const cardX2 = randomCard();
    //                 const cardO1 = randomCard();
    //                 const cardO2 = randomCard();

    //                 // ใส่ db
    //                 update(ref(db, `Matching/${roomId}/card`), {
    //                     player1: [card[0], card[cardX1], card[cardX2]],
    //                     player2: [card[0], card[cardO1], card[cardO2]]
    //                 })

    //                 if (xTurn && x == currentUid) {
    //                     const boardHaveFX: number[] = [...randomBoard()]
    //                     console.log('boardHaveFX is ', boardHaveFX)
    //                     setBoardDatabyBoard(6, '/image/boardFX/boardFX1.svg');
    //                     // for (let board of boardHaveFX){
    //                     //     console.log('board is ', board)
    //                     //     setBoardDatabyBoard(board, '/image/boardFX/boardFX1.svg' );
    //                     //     console.log('boardData is ',boardData)
    //                     // }
    //                     // setBoardDatabyBoard(2, '/image/displayFX/dusplayFX1.svg')
    //                     update(ref(db, `Matching/${roomId}`), {
    //                         board: boardData
    //                     })
    //                 }
    //             }
    //         }
    //         else {
    //             router.push('/')
    //         }

    //     })
    // }
    // multiplayerState()
    // console.log(boardData)

    const updateStatus = async () => {
        // update เป็น playing
        const MatchRef = ref(db, `Matching/${roomId}/player`);
        const data = (await get(MatchRef)).val()
        if (xTurn && data['player1'] == currentUid) {
            update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), { phrase: 'Playing' })
            return
        }
        else if (!xTurn && data['player2'] == currentUid) {
            update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), { phrase: 'Playing' })
            return
        }
    }
    // console.log('test is ', xTurn && o == currentUid)

    return (
        <div className='relative overflow-hidden'>
            <Background />
            <div className='container mx-auto relative z-10'>
                <div id="time&point_sm" className="lg:hidden flex absolute z-20 top-14 inset-x-2/4 -translate-x-34 w-72 h-24 items-center">
                    <div className={`w-24 h-24 border ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `border-black bg-white text-black` : `border-white bg-black text-white`} rounded-full flex justify-center items-center text-4xl z-10`}>
                        {timeLeft}
                    </div>
                    <div className={`w-48 h-16 pl-12 border ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `border-black bg-white text-black` : `border-white bg-black text-white`} -translate-x-8 flex flex-col gap-1 rounded-lg justify-center`}>
                        <div>
                            {x && o ? (xTurn ? player[x].username : player[o].username) : ''}
                        </div>
                        <div className={`flex gap-1 ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `block` : `hidden`}`}>
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
                <div id="time&point_md" className="hidden lg:flex absolute z-20 w-fit h-full">
                    <div className="my-auto flex items-center">
                        <div className={`w-24 h-24 border ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `border-black bg-white text-black` : `border-white bg-black text-white`} rounded-full flex justify-center items-center text-4xl z-10`}>
                            {timeLeft}
                        </div>
                        <div className={`w-48 h-16 pl-12 border ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `border-black bg-white text-black` : `border-white bg-black text-white`} -translate-x-8 flex flex-col gap-1 rounded-lg justify-center`}>
                            <div>
                                {x && o ? (xTurn ? player[x].username : player[o].username) : ''}
                            </div>
                            <div className={`flex gap-1 ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `block` : `hidden`}`}>
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

                    <div id="enemyCard" className={` w-screen flex-none h-48 -translate-y-10`}>
                        <div className="flex flex-col justify-center align-middle gap-4">
                            <div id="userCardContainer" className="container mx-auto flex justify-center relative">
                                {cardEnemy.map((card, index) => (
                                    <Image key={index} src={'/image/card/cardBack.svg'} alt="" width={140} height={280} className={`relative -ml-46 left-23 border rounded-lg translate-y-4 border-white`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col align-middle gap-4 justify-evenly max-w-full px-10">
                        <Board xTurn={xTurn}
                            won={won}
                            draw={draw}
                            boardData={boardData}
                            result={result}
                            // setXTurn={setXTurnbyBoard}
                            updateBoard={updateBoard}
                            setWon={setWonbyBoard}
                            setDraw={setDrawbyBoard}
                            setBoardData={setBoardDatabyBoard}
                            setResult={setResultbyBoard}
                            reset={resetbyBoard}
                            gameStatus={gameStatus}
                            selectedCard={selectedCard}
                            x={x}
                            o={o}
                            currentUid={currentUid}
                            player={player}
                            roomId={roomId}
                            db={db}

                        />

                        <div className={`max-w-lg ${!(selectedCard === ``) ? 'block' : 'hidden'} `}>
                            <ModalCard selectedCard={selectedCard}
                                resetSelectedCard={resetSelectedCard}
                                inhandCard={[...inhandCard]} />
                        </div>

                        <div className={`flex justify-between ${(gameStatus == 'Deciding') && ((xTurn && x == currentUid) || (!xTurn && o == currentUid)) ? 'block' : 'hidden'}`}>
                            <div className={`${btnClass} ${inhandCard.length >= 5 ? 'pointer-events-none opacity-50' : ''}`} onClick={() => { drawTwoCard(); }}>จั่วการ์ด 2 ใบ</div>
                            <div className={`${btnClass}`} onClick={() => { setGameStatus('Playing'); updateStatus() }}>ใช้การ์ดและกา</div>
                        </div>

                        <div className={`flex justify-center ${gameStatus == 'Playing' && ((xTurn && x == currentUid) || (!xTurn && o == currentUid)) ? 'block' : 'hidden'}`}>
                            <div className={`${btnClass} ${!(selectedCard === ``) ? 'block' : 'hidden'} ${!useable ? 'pointer-events-none opacity-50' : ''}`} onClick={() => { checkUseCard() }}>ใช้การ์ด</div>
                            <div className={` text-black text-center p-2 ${(selectedCard === ``) ? 'block' : 'hidden'}`}>เลือกใช้การ์ด หรือกาได้เลย แต่ถ้ากาจะจบเทิร์นนะ</div>
                        </div>
                    </div>

                    <div className="cursor-pointer" onClick={() => { addCard(card[4], 'player1') }}>test add card to X</div>
                    {/* <div className="cursor-pointer" onClick={() => { deleteCard(0, 'player1') }}>test delete 1 card X</div> */}
                    <div className="cursor-pointer" onClick={() => { blind() }}>test function ตาบอด</div>

                    <div id="userCard" className={` w-screen flex-none ${!(selectedCard === ``) ? 'h-40' : 'h-48'}`}>
                        <CardLayout card={[...card]}
                            inhandCard={[...inhandCard]}
                            selectedCard={selectedCard}
                            setSelectedCard={setSelectedCardbyCardLayout} />
                    </div>
                </div>
            </div>

            {/* ส่วนจบเกม */}
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