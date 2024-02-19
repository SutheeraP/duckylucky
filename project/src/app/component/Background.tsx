import React from 'react'
import ImageComp from './ImageComp'

const Background = () => {
    return (
        <>
            <div className='absolute w-40 left-[-5%] md:w-60 md:left-0'>
                <ImageComp path='/image/bg/bg1.svg' />
            </div>
            <div className='absolute w-40 right-[-5%] md:w-52'>
                <ImageComp path='/image/bg/bg2.svg' />
            </div>
            <div className='absolute w-40 top-[70%] md:top-[60%] md:w-52'>
                <ImageComp path='/image/bg/bg3.svg' />
            </div>
            <div className='absolute w-30 top-[80%] md:top-[70%] right-[-5%] md:w-48 md:right-4'>
                <ImageComp path='/image/bg/bg4.svg' />
            </div>
        </>
    )
}

export default Background