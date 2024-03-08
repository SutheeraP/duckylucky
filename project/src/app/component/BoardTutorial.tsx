import React from 'react'
import { useState } from 'react'
import ImageComp from './ImageComp'

const BoardTutorial = () => {
  const [selectId, setSelectedId] = useState(1)
  const board = [
    { id: 1, name: 'พายุร้อน', img: '/image/boardFX/boardFX1.svg', description: 'รีเซ็ตกระดาน' },
    { id: 2, name: 'ความช่วยเหลือของเกรซมิลเลอร์', img: '/image/boardFX/boardFX2.svg', description: 'สลับสัญลักษณ์ทั้งหมดบนกระดาน' },
    { id: 3, name: 'บัญชาจากราชีนีหงส์', img: '/image/boardFX/boardFX3.svg', description: 'เพิ่มค่าพลังการกระทำ 2 หน่วย ในตาถัดไป ให้กับผู้เล่นที่กาช่องนี้' },
    { id: 4, name: 'ของขวัญจากมือระเบิด', img: '/image/boardFX/boardFX4.svg', description: 'สุ่มเกิดการระเบิด 3 ช่อง หลังจากนั้นช่องนั้นๆ จะกลายเป็นช่องว่าง' },
]
  return (

    <div className='relative'>
      <div className='absolute w-full h-full flex z-20 justify-between'>
        <div className='my-auto text-3xl  w-10 h-10 flex  items-center rounded-full'
          onClick={() => {
            let prev = selectId === 1 ? 4 : selectId - 1;
            setSelectedId(prev)
            console.log(prev)
          }}>
          {`${'<'}`}
        </div>
        <div className='my-auto text-3xl  w-10 h-10 flex items-center rounded-full'
          onClick={() => {
            let prev = selectId === 4 ? 1 : selectId + 1;
            setSelectedId(prev)
            console.log(prev)
          }}>
          {`${'>'}`}
        </div>
      </div>
      {/* currentCard */}
      <div className='flex flex-col gap-4 items-center relative'>
        <div className='rounded-lg w-3/5'>
          <ImageComp path={board.find(item => item.id == selectId)?.img} />
        </div>
        <div className='font-semibold text-lg'>{board.find(item => item.id == selectId)?.name}</div>
        <div className='text-center'>{board.find(item => item.id == selectId)?.description}</div>
      </div>




    </div>
  )
}

export default BoardTutorial