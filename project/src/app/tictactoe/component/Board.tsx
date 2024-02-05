import Image from 'next/image'
import A1 from '../image/gridA1.svg'
import A2 from '../image/gridA2.svg'
import A3 from '../image/gridA3.svg'
import A4 from '../image/gridA4.svg'
import B1 from '../image/gridB1.svg'
import B2 from '../image/gridB2.svg'
import B3 from '../image/gridB3.svg'
import B4 from '../image/gridB4.svg'
import C1 from '../image/gridC1.svg'
import C2 from '../image/gridC2.svg'
import C3 from '../image/gridC3.svg'
import C4 from '../image/gridC4.svg'
import D1 from '../image/gridD1.svg'
import D2 from '../image/gridD2.svg'
import D3 from '../image/gridD3.svg'
import D4 from '../image/gridD4.svg'



const Board = () =>{
    return (
        <div className="grid grid-cols-4 grid-rows-4">
            <Image
                src={A1}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={A2}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={A3}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={A4}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={B1}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={B2}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={B3}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={B4}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={C1}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={C2}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={C3}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={C4}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={D1}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={D2}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={D3}
                width={80}
                height={80}
                alt=""
            />
            <Image
                src={D4}
                width={80}
                height={80}
                alt=""
            />
        </div>
    )
}

export default Board;