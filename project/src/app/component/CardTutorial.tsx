import React from 'react'
import { useState } from 'react'
import ImageComp from './ImageComp'

const CardTutorial = () => {
  const [selectId, setSelectedId] = useState(1)



  const card = [
    { id: 1, name: 'ฉันขอปฏิเสธ', point: 1, img: '/image/card/card2.svg', description: 'ปฏิเสธผลกระทบที่เกิดขึ้นจากบอร์ด' },
    { id: 2, name: 'วาจาประกาศิต', point: 2, img: '/image/card/card3.svg', description: 'สั่งผู้เล่นฝ่ายตรงข้ามสุ่มทิ้งการ์ด 1 ใบในมือ' },
    { id: 3, name: 'หัวขโมย', point: 2, img: '/image/card/card4.svg', description: 'ขโมยการ์ดจากฝั่งตรงข้าม 1 ใบแบบสุ่ม' },
    { id: 4, name: 'คำสาปของแม่มดน้ำเงิน', point: 2, img: '/image/card/card5.svg', description: 'ห้ามฝั่งตรงข้ามไม่ให้ใช้สกิลใดได้ 1 รอบ' },
    { id: 5, name: 'จงตาบอดไปซะ', point: 4, img: '/image/card/card6.svg', description: 'ทำให้ฝั่งตรงข้ามมองไม่เห็นสัญลักษณ์ว่าเป็นของใคร เห็นแค่ช่องไหนกาได้หรือไม่ได้ 1 รอบ' }
  ]
  return (

    <div className='relative'>
      <div className='absolute w-full h-full flex z-20 justify-between px-5'>
        <div className='my-auto text-3xl  w-10 h-10 flex justify-center items-center rounded-full '
          onClick={() => {
            let prev = selectId === 1 ? 5 : selectId - 1;
            setSelectedId(prev)
            console.log(prev)
          }}>
          {`${'<'}`}
        </div>
        <div className='my-auto text-3xl w-10 h-10 flex items-center justify-center rounded-full'
          onClick={() => {
            let prev = selectId === 5 ? 1 : selectId + 1;
            setSelectedId(prev)
            console.log(prev)
          }}>
          {`${'>'}`}
        </div>
      </div>
      {/* currentCard */}
      <div className='flex flex-col gap-4 items-center relative'>
        <div className='rounded-lg border border-black w-2/5'>
          <ImageComp path={card.find(item => item.id == selectId)?.img} />
        </div>
        <div className='font-semibold text-lg'>{card.find(item => item.id == selectId)?.name}</div>
        <div className='text-center'>{card.find(item => item.id == selectId)?.description}</div>
      </div>




    </div>
  )
}

export default CardTutorial