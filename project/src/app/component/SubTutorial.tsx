import Image from 'next/image';
import React from 'react'
import { useState } from "react";
const SubTutorial = () => {
    const [detail, setDetail] = useState(<div className='text-center text-primary'>ลองเลือกดูสิ !</div>);
    const [content, setContent] = useState(1);
    const [select, setSelect] = useState(false)
    return (
        <div>
            <ol className='ml-4 flex flex-col gap-12'>
                <li className='list-decimal'>
                    <div className='relative'>
                        <div id="time&point_sm" className="flex w-72 h-24 items-center">
                            <div className={`w-20 h-20 border  border-black bg-white text-black rounded-full flex justify-center items-center text-4xl z-10`}>
                                20
                            </div>
                            <div className={`w-48 h-16 pl-12 border border-black bg-white text-black -translate-x-8 flex flex-col gap-1 rounded-lg justify-center`}>
                                <div>
                                    Anonymous
                                </div>
                                <div className={`flex gap-1`}>
                                    {[...Array(5)].map((v, idx: number) => {
                                        return <div key={v}>
                                            <Image src={'/image/point_full.svg'} alt="" width={16} height={16}></Image>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    ในแต่ละเทิร์นจะมีเวลา 20 วิ และแต้มการ์ด 5 แต้ม</li>
                <li className='list-decimal'>ในเทิร์นของคุณต้องเลือกว่าจะ
                    <div className='flex justify-between align-middle my-2'>
                        <div className='bg-black text-white w-full text-center py-2 rounded-md'
                            onClick={() => {
                                setDetail(
                                    <ol className='ml-4'>
                                        <li className='list-disc'>
                                            หากมีการ์ดในมือมากกกว่า 2 ใบจะไม่สามารถจั่วได้
                                        </li>
                                    </ol>

                                )
                            }}
                        >จั่วการ์ด 2 ใบ</div>
                        <div className='w-fit my-auto px-3'>หรือ</div>
                        <div className='bg-black text-white w-full text-center py-2 rounded-md'
                            onClick={() => {
                                setDetail(
                                    <ol className='ml-4'>
                                        <li className='list-disc'>สามารถกดใช้การ์ดได้ตามแต้มการ์ดที่มี</li>
                                        <li className='list-disc'>เมื่อกาจะถือว่าจบเทิร์นทันที</li>
                                        <li className='list-disc'>ในกระดานมีช่องพิเศษซ่อนอยู่ ระวังตัวให้ดีล่ะ!</li>
                                    </ol>
                                )
                            }}
                        >ใช้การ์ดและกา</div>
                    </div>
                    {detail}
                </li>
                <li className='list-decimal'>เรียงสัญลักษณ์ให้ครบ 4 ช่องเพื่อเป็นผู้ชนะ!</li>
            </ol>
        </div>
    )
}

export default SubTutorial