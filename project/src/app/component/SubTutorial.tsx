import Image from 'next/image';
import React from 'react'
import { useState } from "react";
const SubTutorial = () => {
    const [detail, setDetail] = useState(<div className='text-center text-primary'>ลองเลือกดูสิ !</div>);
    const [content, setContent] = useState(1);
    const [select, setSelect] = useState(false)
    const btnClass = `transition duration-200 ease-in-out bg-black text-white w-full hover:bg-primary text-center py-2 cursor-pointer rounded-md`
    return (
        <div>
            <ol className='ml-4 flex flex-col gap-6'>
                <li className='list-decimal'>
                    <div className='flex justify-between align-middle'>
                        <div className='w-fit my-auto pr-3'>เลือก</div>
                        <div className={btnClass}>สุ่มห้อง</div>
                        <div className='w-fit my-auto px-3'>หรือ</div>
                        <div className={btnClass}>สร้างห้อง</div>
                    </div>
                </li>
                <li className='list-decimal'>
                    <div>เมื่อเข้าเกม</div>
                    <ol className='ml-4'>
                        <li className='list-disc'>แต่ละฝั่งจะได้รับ<span className='font-semibold'>การ์ด</span> 2 ใบ</li>
                        <li className='list-disc'>บอร์ดจะสุ่ม<span className='font-semibold'>ช่องพิเศษ</span> 6 ช่องที่สามารถเลือกลงหรือหลบเลี่ยงได้</li>
                    </ol>
                </li>
                <li className='list-decimal'>
                    <div>ในแต่ละเทิร์นมีเวลา 20 วิ และแต้มการ์ด 5 แต้ม</div>
                    <div className='relative'>
                        
                        <div id="time&point_sm" className="flex w-72 h-20 items-center">
                            <div className={`w-16 h-16 border  border-black bg-white text-black rounded-full flex justify-center items-center text-xl z-10`}>
                                20
                            </div>
                            <div className={`w-40 h-12 pl-12 border border-black bg-white text-black -translate-x-8 flex flex-col gap-1 rounded-lg justify-center text-sm`}>
                                <div>
                                    Anonymous
                                </div>
                                <div className={`flex gap-1`}>
                                    {[...Array(5)].map((v, idx: number) => {
                                        return <div key={v}>
                                            <Image src={'/image/point_full.svg'} alt="" width={10} height={10}></Image>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    </li>
                <li className='list-decimal'>ในเทิร์นของคุณต้องเลือกว่าจะ
                    <div className='flex justify-between align-middle my-2'>
                        <div className={btnClass}
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
                        <div className={btnClass}
                            onClick={() => {
                                setDetail(
                                    <ol className='ml-4'>
                                        <li className='list-disc'>สามารถกดใช้การ์ดได้ตามแต้มการ์ดที่มี</li>
                                        <li className='list-disc'>เมื่อกาจะถือว่าจบเทิร์นทันที</li>
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