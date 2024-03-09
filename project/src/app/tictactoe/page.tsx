"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getDatabase, ref, set, onValue, update, remove, child, get, push } from "firebase/database";
import { db } from "../firebase";
import ImageComp from "../component/ImageComp";
import Image from "next/image"
import Board from "./component/Board";
import CardLayout from "./component/CardLayout";
import ModalCard from "./component/MadalCard";
import NotifyBoardFX from "./component/NotifyBoardFX";
import { v4 as uuidv4 } from 'uuid';

import { useState, useEffect } from "react"
import Background from "../component/Background";
import { start } from "repl";
import { WindSong } from "@next/font/google";

export default function TicTacToe(params: any) {
    // console.log('auto repage')
    const router = useRouter()
    const [roomId, setRoomId] = useState(params['searchParams']['match'])

    // เก็บ default ต่าง ๆ
    const [x, setX] = useState('');
    const [o, setO] = useState('');
    const [enemyId, setEnemyId] = useState('');
    const [myPlayer, setMyPlayer] = useState('');
    const [enemyPlayer, setEnemyPlayer] = useState('');
    const [myScore, setMyScore] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);

    // เก็บ index ของ object boardFX
    const [effectOnBoard, setEffectOnBoard] = useState('');

    // แก้บัค 


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

    // for effect
    const [blinding, setBlinding] = useState(false)
    const [cnacelBoard, setCancelBoard] = useState(false)
    const [showNotify, setShowNotify] = useState(false)
    const [cardNotify, setCardNotify] = useState<any>(``)
    const [winner, setWinner] = useState('');

    // for boardFX
    const [showBoardFXNotify, setShowBoardFXNotify] = useState(false)
    const [boardFXNotify, setBoardFXNotify] = useState<any>(``)

    // for start everyturn
    const [showStartTurn, setShowStartTurn] = useState(false)

    // for แสดง username
    // fix bug player[x]
    const [nameX, setNameX] = useState('');
    const [nameO, setNameO] = useState('');
    const [imgX, setImgX] = useState('');
    const [imgO, setImgO] = useState('');

    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin');
        },
    })

    // ดึง userid ครั้งแรก
    useEffect(() => {
        const getUserId = async () => {
            const data = (await get(userRef)).val()
            if (data) {
                Object.keys(data).forEach((key) => {
                    let obj = data[key] as User
                    if (obj.email == session?.data?.user?.email) {
                        setCurrentUid(key)
                    }
                })
            }
        }
        getUserId()
    }, [session?.data?.user?.email])

    interface User {
        email: string;
        profile_img: string;
        username: string;
        score: number;
        match: number;
        win: number;
    }

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

    // const setWonbyBoard = (bool: boolean) => {
    //     setWon(bool)
    // }

    // const setDrawbyBoard = (bool: boolean) => {
    //     setDraw(bool)
    // }

    const setBoardDatabyBoard = (idx: number, value: any) => {
        setBoardData({ ...boardData, [idx]: value });
        console.log(idx)
        console.log(value)
    }

    const setResultbyBoard = (string: string) => {
        setResult(string);
    }

    const card = [
        { id: 1, name: 'ฉันขอปฏิเสธ', point: 1, img: '/image/card/card2.svg', description: 'ปฏิเสธผลกระทบจากช่องพิเศษในรอบนี้' },
        { id: 2, name: 'วาจาประกาศิต', point: 2, img: '/image/card/card3.svg', description: 'สั่งผู้เล่นฝ่ายตรงข้ามสุ่มทิ้งการ์ด 1 ใบในมือ' },
        { id: 3, name: 'หัวขโมย', point: 2, img: '/image/card/card4.svg', description: 'ขโมยการ์ดจากฝั่งตรงข้าม 1 ใบแบบสุ่ม' },
        { id: 4, name: 'คำสาปของแม่มดน้ำเงิน', point: 2, img: '/image/card/card5.svg', description: 'ห้ามฝั่งตรงข้ามไม่ให้ใช้การ์ดใดได้ 1 รอบ' },
        { id: 5, name: 'จงตาบอดไปซะ', point: 4, img: '/image/card/card6.svg', description: 'ทำให้ฝั่งตรงข้ามมองไม่เห็นสัญลักษณ์ เห็นแค่ช่องไหนกาได้หรือไม่ได้ 1 รอบ' }
    ]
    type CardType = any

    const boardFX = [
        { id: 1, name: 'พายุร้อน', img: '/image/boardFX/boardFX1.svg', description: 'รีเซ็ตกระดาน' },
        { id: 2, name: 'ความช่วยเหลือของเกรซมิลเลอร์', img: '/image/boardFX/boardFX2.svg', description: 'สลับสัญลักษณ์ทั้งหมดบนกระดาน' },
        { id: 3, name: 'บัญชาจากราชีนีหงส์', img: '/image/boardFX/boardFX3.svg', description: 'เพิ่มค่าพลังการกระทำ 2 หน่วย ในตาถัดไป ให้กับผู้เล่นที่กาช่องนี้' },
        { id: 4, name: 'ของขวัญจากมือระเบิด', img: '/image/boardFX/boardFX4.svg', description: 'สุ่มเกิดการระเบิด 3 ช่อง หลังจากนั้นช่องนั้นๆ จะกลายเป็นช่องว่าง' },
    ]

    const displayFX = [
        '/image/boardFX/displayFX1.svg',
        '/image/boardFX/displayFX2.svg',
        '/image/boardFX/displayFX3.svg',
        '/image/boardFX/displayFX4.svg',
        '/image/boardFX/displayFX5.svg',
        '/image/boardFX/displayFX6.svg'
    ]

    const randomBoard = (num: number) => {
        let numbers = [];
        let numboard = [];
        for (let i = 0; i <= 15; i++) {
            numbers.push(i);
        }
        for (let i = 1; i <= num; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            const randomNumber = numbers[randomIndex];
            numbers.splice(randomIndex, 1);
            numboard.push(randomNumber)
        }

        // return ช่องที่มี effect พิเศษ
        return numboard;
    }

    const randomDisplayFX = (num: number) => {
        let numbers = [];
        let numdisplayFX = [];
        for (let i = 1; i <= 6; i++) {
            numbers.push(i);
        }
        for (let i = 1; i <= num; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            const randomNumber = numbers[randomIndex];
            numbers.splice(randomIndex, 1);
            numdisplayFX.push(randomNumber)
        }
        return numdisplayFX;
    }

    const randomFX = (num: number) => {
        let numbers = [];
        let numFX = [];
        for (let i = 0; i < 4; i++) {
            numbers.push(i);
        }
        // ลิสสี่ช่อง

        // ใส่เอเฟคตามจำนวนที่บอก
        for (let i = 1; i <= num; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length); // สุ่ม 1-4
            const randomNumber = numbers[randomIndex]; // ชี้ 1-4
            // numbers.splice(randomIndex, 1); // เอาออก
            numFX.push(randomNumber) // เอาเอฟคเฟคใส่ลิส
        }
        return numFX;
    }

    const randomCard = () => { return Math.floor(Math.random() * 5) }
    // random เลข 0-4 เพื่อเอาไปดึง card มาใส่ใน inhandcard

    const drawTwoCard = async () => {
        // สุ่ม 2 ใบ
        const card1 = randomCard();
        const card2 = randomCard();

        // เพิ่ม
        await addCard(card[card1], myPlayer)
        await addCard(card[card2], myPlayer)

        // จบเทิน
        update(ref(db, `Matching/${roomId}`), {
            currentTurn: !xTurn
        })
        update(ref(db, `Matching/${roomId}`), {
            time: 20
        })
        update(ref(db, `Matching/${roomId}/score`), {
            [currentUid]: myScore + 30
        })
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
        // กดได้แปลว่า point พออยู่แล้ว
        let thiscard = inhandCard[selectedCard]

        // update pont ใน db
        update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
            action: point - inhandCard[selectedCard].point
        })

        //สั่ง notify ฝ่ายตรงข้าม
        update(ref(db, `Matching/${roomId}/notify/${enemyId}`), {
            card: thiscard.id
        })

        //เพิ่มคะแนนใช้การ์ด
        update(ref(db, `Matching/${roomId}/score`), {
            [currentUid]: myScore + thiscard.point * 50
        })

        //ใช้ คำสั่งการ์ด
        if (thiscard.id == 1) {
            // ขอปฎิเสธ
            setCancelBoard(true)
        }

        else if (thiscard.id == 2) {
            // วาจาประกาศิต สุ่มลบฝั่งตรงข้าม 1 ใบ
            let lenCard = cardEnemy.length
            if (lenCard) {
                let ranCard = Math.floor(Math.random() * lenCard) //สุ่มเลข index
                deleteCard(ranCard, enemyPlayer)
            }
        }

        else if (thiscard.id == 3) {
            // หัวขโมย 1 ใบ
            let lenCard = cardEnemy.length
            if (lenCard) {
                let ranCard = Math.floor(Math.random() * lenCard) //สุ่มเลข index
                addCard(cardEnemy[ranCard], myPlayer)
                deleteCard(ranCard, enemyPlayer)
            }
        }

        else if (thiscard.id == 4) {
            //  คำสาปของแม่มดน้ำเงิน
            blockCard()
        }
        else if (thiscard.id == 5) {
            // จงตาบอด
            blind()
        }

        // ลบการ์ดใน db
        deleteCard(selectedCard, myPlayer)

        // รี selectCard
        setSelectedCard('')
    }

    // time countdown
    useEffect(() => {
        const countdown = setTimeout(() => {
            if (winner == '') {
                if (timeLeft === 0) {
                    update(ref(db, `Matching/${roomId}`), {
                        currentTurn: !xTurn
                    })
                    update(ref(db, `Matching/${roomId}`), {
                        time: 20
                    })
                } else {
                    update(ref(db, `Matching/${roomId}`), {
                        time: timeLeft - 1
                    })
                }
            }
        }, 1000);

        return () => clearTimeout(countdown);

    }, [xTurn, timeLeft]);

    // all ref
    const userRef = ref(db, `UserList`);
    const gameRef = ref(db, `Matching/${roomId}`);
    const cardRef = ref(db, `Matching/${roomId}/card`);
    const turnRef = ref(db, `Matching/${roomId}/currentTurn`);
    const timeRef = ref(db, `Matching/${roomId}/time`);
    const boardRef = ref(db, `Matching/${roomId}/board`);
    const effectRef = ref(db, `Matching/${roomId}/effect`);
    const actionRef = ref(db, `Matching/${roomId}/player`);
    const notifyRef = ref(db, `Matching/${roomId}/notify`);
    const scoreRef = ref(db, `Matching/${roomId}/score`);
    const winnerRef = ref(db, `Matching/${roomId}/winner`);
    const effectonboardRef = ref(db, `Matching/${roomId}/effectonboard`);

    // อดึงชื่อ/รูปเมื่ออัพเดต x,o
    useEffect(() => {
        console.log('in use effect xo')
        const getUser = async () => {
            const data = (await get(userRef)).val()
            if (data) {
                if (data[x]) {
                    // console.log('founX')
                    setNameX(data[x]['username'])
                    setImgX(data[x]['profile_img'])
                }
                if (data[o]) {
                    // console.log('founO')
                    setNameO(data[o]['username'])
                    setImgO(data[o]['profile_img'])
                }


                if (x == currentUid) {
                    setEnemyId(o)
                    setMyPlayer('player1')
                    setEnemyPlayer('player2')
                    console.log('set en id here')
                }
                else if (o == currentUid) {
                    setEnemyId(x)
                    setMyPlayer('player2')
                    setEnemyPlayer('player1')
                    console.log('set en id here')
                }
            }
        }
        getUser()

    }, [x, o])

    // รวมดัก onvalue
    useEffect(() => {
        console.log('in user effect uid')
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
                let initBoard: { [key: string]: string } = {
                    0: '',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: '',
                    7: '',
                    8: '',
                    9: '',
                    10: '',
                    11: '',
                    12: '',
                    13: '',
                    14: '',
                    15: ''
                }

                // random ค่าเพื่อหา board ที่จะมี FX และ รูปของ FX ที่จะเอามาแสดงผลแบบสุ่ม
                const numBoard = [...randomBoard(6)] //ได้ช่อง 6 ช่อง จาก 16
                const numDisplay = [...randomDisplayFX(6)] //ได้รูป 6 รูป
                const effectonboard = [...randomFX(6)] //ได้เอฟเฟค 6 เอฟเฟค

                // set ค่าของ initBoard ให้เป็นรูป FX ตามช่องที่สุ่มได้
                for (let i = 0; i < 6; i++) {
                    initBoard[numBoard[i]] = `/image/displayFX/displayFX${numDisplay[i]}.svg`
                }

                // เซ็ตเกมตอนไม่ครั้งแรกที่เล่น ด้วย initBoard
                update(ref(db, `Matching/${roomId}`), {
                    board: initBoard
                })

                // set ค่า FX เป็นลำดับ
                update(ref(db, `Matching/${roomId}`), {
                    effectonboard: effectonboard
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
                    player1: [card[cardX1], card[cardX2]],
                    player2: [card[cardO1], card[cardO2]]
                })
            }
        })

        onValue(effectonboardRef, (snapshot: any) => {
            const data = snapshot.val();
            console.log(data)
            setEffectOnBoard(data)
        })

        // turn listener
        onValue(turnRef, (snapshot: any) => {
            const data = snapshot.val();

            // console.log('thie player is ', PlayerData)
            // console.log('turnref is ',data)
            // console.log('x is ',x)

            // update player action
            setMaxPoint(5)
            update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
                action: 5,
                phrase: 'Deciding'
            })

            setXTurn(data) // update turn ในเกม
            effectTurn() // update turn ในเอฟเฟคที่ทำงานอยู่

            // get ข้อมูล Player มาใหม่ เหมือนปัญหามันเป็นเกี่ยวกะบล็อคสโคปรึป่าวไม่แน่ใจ
            get(ref(db, `Matching/${roomId}/player`)).then((snapshot) => {
                const PlayerData = snapshot.val();

                // show แจ้งเตือนตอนเริ่มเทริ์น 1 วิ
                if (!(data === null)){
                    if ((data && currentUid == PlayerData['player1']) || (!data && currentUid == PlayerData['player2'])) {
                        setShowStartTurn(true);
                    }
                    setTimeout(() => {
                        setShowStartTurn(false);
                    }, 1000);
                }
            })
            .catch((error) => {
                console.error("Error fetching player data:", error);
            });
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

        // action listener
        onValue(actionRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data && data.PlayerActionInTurn) {
                if (data.PlayerActionInTurn.phrase) {
                    setGameStatus(data.PlayerActionInTurn.phrase)
                }
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
            if (data) { effectWork(data) }
        })

        // notify listen
        onValue(notifyRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                if (data[currentUid]) {
                    if (data[currentUid]['card']) {
                        notifyCard(data[currentUid]['card'])
                    }
                    if (data[currentUid]['boardFX']) {
                        notifyBoardFX(data[currentUid]['boardFX'])
                    }
                }
            }
        })

        //score listener 
        onValue(scoreRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                if (data[currentUid]) {
                    setMyScore(data[currentUid])
                }

            }
        })

        //winner listener
        onValue(winnerRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
                setWinner(data)
            }
        })
    }, currentUid); // มี uid แล้วรันครั้งแรก

    // update card ตามฝั่ง
    useEffect(() => {
        console.log('update card')
        if (x == currentUid) {
            setInhandCard(cardX)
            setCardEnemy(cardO)
        }
        if (o == currentUid) {
            setInhandCard(cardO)
            setCardEnemy(cardX)
        }
    }, [cardX, cardO]);

    const notifyCard = async (cardId: number) => {
        // ขึ้นมา 3 วิแล้วหายไป
        let thisCard = card.find(item => item.id == cardId);
        setCardNotify(thisCard)
        setShowNotify(true)

        setTimeout(() => {
            setShowNotify(false);
            remove(ref(db, `Matching/${roomId}/notify/${currentUid}/card`));
        }, 3000);
    }

    const notifyBoardFX = async (boardFXId: number) => {
        // ขึ้นมา 3 วิแล้วหายไป
        let thisBoardFX = boardFX.find(item => item.id == boardFXId);
        setBoardFXNotify(thisBoardFX)
        setShowBoardFXNotify(true)

        setTimeout(() => {
            setShowBoardFXNotify(false);
            remove(ref(db, `Matching/${roomId}/notify/${currentUid}/boardFX`));
        }, 3000);
    }

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
        update(ref(db, `Matching/${roomId}/effect/${myPlayer}/blockCard`), {
            turn: 1,
            target: enemyId
        })
    }

    // การ์ดจงตาบอด
    const blind = async () => {
        update(ref(db, `Matching/${roomId}/effect/${myPlayer}/blind`), {
            turn: 1,
            target: enemyId
        })
    }

    // FX พายุฤดูร้อน
    const resetBoard = async () => {
        const dbBoard = (await get(ref(db, `Matching/${roomId}/board`))).val()
        for (let i = 0; i < 16; i++) {
            if ((Object.values(dbBoard)[i] == '/image/displayFX/displayFX1.svg') ||
                (Object.values(dbBoard)[i] == '/image/displayFX/displayFX2.svg') ||
                (Object.values(dbBoard)[i] == '/image/displayFX/displayFX3.svg') ||
                (Object.values(dbBoard)[i] == '/image/displayFX/displayFX4.svg') ||
                (Object.values(dbBoard)[i] == '/image/displayFX/displayFX5.svg') ||
                (Object.values(dbBoard)[i] == '/image/displayFX/displayFX6.svg')) {
            }
            else {
                update(ref(db, `Matching/${roomId}/board`), {
                    [i]: ''
                })
            }
        }
    }

    // FX ความช่วยเหลือของเกรซมิลเลอร์
    const swapXO = async () => {
        const dbBoard = (await get(ref(db, `Matching/${roomId}/board`))).val()
        for (let i = 0; i < 16; i++) {
            if (Object.values(dbBoard)[i] == imgX) {
                update(ref(db, `Matching/${roomId}/board`), {
                    [i]: imgO
                })
                console.log('X -> O')
            }
            else if (Object.values(dbBoard)[i] == imgO) {
                update(ref(db, `Matching/${roomId}/board`), {
                    [i]: imgX
                })
                console.log('O -> X')
            }
        }
    }

    // FX บัญชาจากราชินีหงส์
    const increaseActionPoint = async () => {
        update(ref(db, `Matching/${roomId}/effect/${myPlayer}/increaseActionPoint`), {
            turn: 1,
            target: currentUid
        })
    }

    // FX ของขวัญจากมือระเบิด
    const bombRandomBoard = async () => {
        let bomb = randomBoard(3)
        for (let i = 0; i < 16; i++) {
            if (i == bomb[0] || i == bomb[1] || i == bomb[2]) {
                update(ref(db, `Matching/${roomId}/board`), {
                    [i]: ''
                })
            }
        }
    }

    // ไว้ update turn ให้การ์ดที่ทำงานอยู่
    const effectTurn = async () => {
        const data = (await get(effectRef)).val()
        let playerSet = ['player1', 'player2']
        if (data) {
            playerSet.forEach(p => {
                if (data[p]) {
                    if (data[p]['blockCard']) {
                        update(ref(db, `Matching/${roomId}/effect/${p}/blockCard`), {
                            turn: data[p]['blockCard']['turn'] + 1
                        })
                    }
                    if (data[p]['blind']) {
                        update(ref(db, `Matching/${roomId}/effect/${p}/blind`), {
                            turn: data[p]['blind']['turn'] + 1
                        })
                    }
                    if (data[p]['increaseActionPoint']) {
                        update(ref(db, `Matching/${roomId}/effect/${p}/increaseActionPoint`), {
                            turn: data[p]['increaseActionPoint']['turn'] + 1
                        })
                    }
                }
            });
        }
    }

    // ทำงาน effect ทุกอย่าง
    const effectWork = async (data: any) => {
        const dbBoard = (await get(ref(db, `Matching/${roomId}/board`))).val()
        const userList = get(ref(db, `UserList`))
        const XandO = (await get(ref(db, `Matching/${roomId}/player`))).val()
        // console.log(userList)
        let player = ['player1', 'player2']
        // console.log(imgX)
        // console.log(imgO)
        player.forEach(p => {
            if (data[p]) {

                // คำสาปแม่มด ห้ามใช้การ์ด
                if (data[p]['blockCard']) {
                    if (data[p]['blockCard']['turn'] == 2 && currentUid == data[p]['blockCard']['target']) {
                        // ปรับ point เปน 0
                        update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
                            action: 0
                        })
                    }
                    if (data[p]['blockCard']['turn'] >= 3) {
                        remove(ref(db, `Matching/${roomId}/effect/${p}/blockCard`));
                    }
                }

                // จงตาบอด ไม่ให้ดูสัญลักษณ์
                if (data[p]['blind']) {
                    if (data[p]['blind']['turn'] >= 1 && currentUid == data[p]['blind']['target']) {
                        setBlinding(true)
                    }
                    if (data[p]['blind']['turn'] >= 3 && currentUid == data[p]['blind']['target']) {
                        setBlinding(false) // กลับมาแดงผล
                        remove(ref(db, `Matching/${roomId}/effect/${p}/blind`));
                    }
                }

                // FX บัญชาจากราชินีหงส์
                if (data[p]['increaseActionPoint']) {
                    console.log('increaseActionPoint')
                    if (data[p]['increaseActionPoint']['turn'] == 3) {
                        // console.log('set action to 7')
                        setMaxPoint(7)
                        update(ref(db, `Matching/${roomId}/player/PlayerActionInTurn`), {
                            action: 7
                        })
                        remove(ref(db, `Matching/${roomId}/effect/${p}/increaseActionPoint`));
                    }
                }
            }
        })


    }

    const btnClass = 'bg-black text-white rounded-lg ring-1 flex w-40 p-2 justify-center items-center cursor-pointer hover:bg-white hover:text-black hover:scale-105 hover:ring-black'

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


    return (
        <div className='relative overflow-hidden'>
            <Background />

            {showStartTurn? 
                <div className="flex justify-center items-center w-screen z-30 h-screen absolute top-0">
                    <div className="w-screen flex flex-row justify-center items-center gap-2">
                        <div className="translate-y-4"><Image src={'/image/sword_L.svg'} alt="" width={50} height={16}></Image></div>
                        <div className="w-52 flex justify-center">
                            <div className="w-52">
                                <div className="text-white font-bold text-2xl absolute text-center font-outline-6">ถึงตาของคุณแล้ว !</div>
                                <div className="text-white font-bold text-2xl absolute text-center">ถึงตาของคุณแล้ว !</div>
                            </div>
                        </div>
                        <div className="translate-y-4"><Image src={'/image/sword_R.svg'} alt="" width={50} height={16}></Image></div>
                    </div>
                </div>
                :null}

            {showNotify ?
                <div className="bg-black bg-opacity-70 w-full z-30 h-screen absolute top-0 flex flex-col justify-center items-center">
                    <div className="flex flex-col gap-4 items-center px-4">
                        <div className="bg-white px-8 py-2 rounded-full font-bold w-fit text-xl">{x == currentUid ? nameO : nameX} โจมตี !</div>
                        <div className="grid grid-cols-2 bg-white p-4 rounded-lg md:w-[400px] w-[350px] relative">
                            <div className="border border-black rounded-lg">
                                <ImageComp path={cardNotify.img} />
                            </div>

                            <div className="my-auto text-center px-2">
                                <div className="font-bold mb-3 text-lg">{cardNotify.name}</div>
                                <div>{cardNotify.description}</div>
                            </div>
                            <div className="absolute top-4 right-4 w-7 h-7 bg-black rounded-full text-white text-lg font-semibold flex justify-center items-center" onClick={() => { setShowNotify(false) }}>x</div>
                        </div>
                    </div>
                </div> :
                null}

            {showBoardFXNotify? <NotifyBoardFX boardFXNotify={boardFXNotify}/>:null}

            {/* ส่วนหลัก */}
            <div className='container mx-auto relative z-10'>
                <div id="time&point_sm" className="lg:hidden flex absolute z-20 top-14 inset-x-2/4 -translate-x-34 w-72 h-24 items-center">
                    <div className={`w-24 h-24 border ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `border-black bg-white text-black` : `border-white bg-black text-white`} rounded-full flex justify-center items-center text-4xl z-10`}>
                        {timeLeft}
                    </div>
                    <div className={`w-48 h-16 pl-12 border ${(xTurn && x == currentUid) || (!xTurn && o == currentUid) ? `border-black bg-white text-black` : `border-white bg-black text-white`} -translate-x-8 flex flex-col gap-1 rounded-lg justify-center`}>
                        <div>
                            {x && o ? (xTurn ? nameX : nameO) : ''}
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
                                {x && o ? (xTurn ? nameX : nameO) : ''}
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
                            // setWon={setWonbyBoard}
                            // setDraw={setDrawbyBoard}
                            setBoardData={setBoardDatabyBoard}
                            setResult={setResultbyBoard}
                            reset={resetbyBoard}
                            gameStatus={gameStatus}
                            selectedCard={selectedCard}
                            x={x}
                            o={o}
                            currentUid={currentUid}
                            imgX={imgX}
                            imgO={imgO}
                            myScore={myScore}
                            enemyScore={enemyScore}
                            enemyId={enemyId}
                            effectOnBoard={effectOnBoard}
                            boardFX={boardFX}

                            roomId={roomId}
                            db={db}
                            blinding={blinding}
                            cancelBoard={cnacelBoard}
                            setCancelBoard={setCancelBoard}
                            resetBoard={resetBoard}
                            swapXO={swapXO}
                            increaseActionPoint={increaseActionPoint}
                            bombRandomBoard={bombRandomBoard}

                        />

                        <div className={`max-w-lg ${!(selectedCard === ``) ? 'block' : 'hidden'} `}>
                            <ModalCard selectedCard={selectedCard}
                                resetSelectedCard={resetSelectedCard}
                                inhandCard={[...inhandCard]} />
                        </div>

                        <div className={`flex justify-between ${(gameStatus == 'Deciding') && ((xTurn && x == currentUid) || (!xTurn && o == currentUid)) ? 'block' : 'hidden'}`}>
                            <div className={`${btnClass} ${inhandCard.length >= 3 ? 'pointer-events-none opacity-50' : ''}`} onClick={() => { drawTwoCard(); }}>จั่วการ์ด 2 ใบ</div>
                            <div className={`${btnClass}`} onClick={() => { setGameStatus('Playing'); updateStatus() }}>ใช้การ์ดและกา</div>
                        </div>

                        <div className={`flex justify-center ${gameStatus == 'Playing' && ((xTurn && x == currentUid) || (!xTurn && o == currentUid)) ? 'block' : 'hidden'}`}>
                            <div className={`${btnClass} ${!(selectedCard === ``) ? 'block' : 'hidden'} ${!useable ? 'pointer-events-none opacity-50' : ''}`} onClick={() => { checkUseCard() }}>ใช้การ์ด</div>
                            <div className={` text-black text-center p-2 ${(selectedCard === ``) ? 'block' : 'hidden'}`}>เลือกใช้การ์ด หรือกาได้เลย แต่ถ้ากาจะจบเทิร์นนะ</div>
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

            {/* ส่วนจบเกม */}
            <div className={` bg-black bg-opacity-50 w-full z-30 h-screen absolute top-0 flex flex-col justify-center items-center ${(winner != '') ? 'flex' : 'hidden'}`}>
                <div className="text-white font-bold text-3xl">{(winner == 'draw') ? 'เสมอ' : (winner == currentUid) ? 'คุณชนะ !' : 'คุณแพ้ !'}</div>
                <Image src={(x == currentUid) ? imgX : imgO} alt="" width={200} height={200} />
                <div className={`flex flex-row ${draw || xTurn ? 'gap-28 translate-y-6' : 'gap-28 -translate-y-2'} absolute`}>
                    <Image src={!(winner == 'draw' || winner == currentUid) ? '/image/lose_Lwing.svg' : '/image/win_Lwing.svg'} alt="" width={120} height={120} />
                    <Image src={!(winner == 'draw' || winner == currentUid) ? '/image/lose_Rwing.svg' : '/image/win_Rwing.svg'} alt="" width={120} height={120} />
                </div>
                <div className="flex flex-col justify-center text-center transform -translate-y-8">
                    <div className="bg-black text-white font-bold text-md rounded-xl w-40 h-auto flex justify-center p-1 ">{(x == currentUid) ? nameX : nameO}</div>
                    <div className="text-white text-sm transform">{myScore} คะแนน</div>
                </div>
                <div className="bg-white text-black text-sm rounded-md w-36 flex justify-center items-center p-2 mt-10 border-solid border-2 border-black" onClick={() => { router.push(`/`); }}>กลับหน้าหลัก</div>
            </div>
        </div>
    )
}