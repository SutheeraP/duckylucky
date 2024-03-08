import Image from "next/image";

const NotifyBoardFX = (props:any) => {
    const { boardFXNotify } = props
    // console.log('this notifyBoardFX is ', boardFXNotify)

    return(
        <div className="flex bg-black bg-opacity-50 justify-center items-center w-screen z-30 h-screen absolute top-0">
            <div className="flex flex-col gap-4">
                <div className="font-bold text-xl flex justify-center bg-grayFX rounded-lg p-3 w-40">ช่องพิเศษทำงาน</div>
                <div className="flex flex-col justify-center">
                    <Image src={`${boardFXNotify.img}`} alt=""  width={240} height={280} className={`relative`} />
                    <div className="text-white font-bold text-3xl flex justify-center -translate-y-8">{boardFXNotify.name}</div>
                </div>
                <div className="text-white font-bold text-xl flex justify-center -translate-y-8">{boardFXNotify.description}</div>
            </div>
        </div>
    )
}

export default NotifyBoardFX;