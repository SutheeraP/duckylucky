import React from 'react'
import { useState } from "react";
import SubTutorial from './SubTutorial';
import CardTutorial from './CardTutorial';
import BoardTutorial from './BoardTutorial';

const Tutorial = (props:any) => {
    const {setShowTutorial} = props
    const [content, setContent] = useState(1);
    const data = [
        { id: 1, title: 'วิธีเล่น', content: <><SubTutorial/></> },
        { id: 2, title: 'การ์ด', content: <><CardTutorial/></> },
        { id: 3, title: 'ช่องพิเศษ', content: <><BoardTutorial/></> }
    ]
    return (
        <div className="absolute h-full w-full flex z-20 bg-[#0005]">
            <div className="container px-4 m-auto md:w-[600px] w-[400px]">
                <div className=" bg-white ring-2 ring-black py-12 rounded-lg grid gap-4 relative">
                <div className="absolute top-4 right-4 w-7 h-7 bg-black rounded-full text-white text-lg font-semibold flex justify-center items-center" onClick={() => { setShowTutorial(false) }}>x</div>
                    <div className='text-3xl font-semibold text-center'>Ducky Lucky</div>
                    <div className='flex gap-4 justify-between px-4'>
                        {data.map(item =>
                            <div key={item.id} onClick={()=>{setContent(item.id)}} className={`border-2 border-black rounded-lg w-full text-center py-1 transition duration-200 ease-in-out hover:bg-black hover:text-white ${content == item.id? 'bg-black text-white': ''}`}>
                                {item.title}
                            </div>
                        )}
                    </div>
                    <div className='px-4 mt-4'>
                        {data.find(item => item.id == content)?.content}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tutorial