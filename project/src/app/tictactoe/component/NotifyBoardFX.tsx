import Image from "next/image";

const NotifyBoardFX = (props:any) => {
    const { boardFXNotify } = props
    // console.log('this notifyBoardFX is ', boardFXNotify)

    return(
        <div className="flex bg-black bg-opacity-50 justify-center items-center w-screen z-30 h-screen absolute top-0">
            <div className="flex flex-col gap-4 w-screen p-4">
                <div className="flex justify-center items-center">
                    <div className={` bg-grayFX rounded-full py-2 px-4 font-bold md:text-md text-center`}>
                        ช่องพิเศษทำงาน
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex justify-center">
                        <Image src={`${boardFXNotify.img}`} alt=""  width={240} height={280}/>
                    </div>
                    <div className="flex justify-center -translate-y-8">
                        <div className={`text-white font-bold md:text-3xl py-2 px-4 rounded-lg font-outline-6 absolute text-center`}>
                            {boardFXNotify.name}
                        </div> 
                        <div className={`text-white font-bold md:text-3xl py-2 px-4 rounded-lg absolute text-center`}>
                            {boardFXNotify.name}
                        </div> 
                    </div>
                </div>
                <div className={`text-white font-bold md:text-md flex justify-center md:translate-y-4 sm:translate-y-2 text-center`}>{boardFXNotify.description}</div>
            </div>
        </div>
    )
}

export default NotifyBoardFX;