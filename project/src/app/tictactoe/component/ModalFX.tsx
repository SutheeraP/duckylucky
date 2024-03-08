import Image from "next/image";

const ModalFX = (props:any) => {
    // const {selectedCard, resetSelectedCard, inhandCard} = props

    return(
        <div className="flex bg-black bg-opacity-50 justify-center items-center w-screen z-30 h-screen absolute top-0">
            <div className="flex flex-col gap-4">
                <div>
                    <Image src={'/image/boardFX/boardFX1.svg'} alt=""  width={240} height={280} className={`relative`} />
                    <div className="text-white font-bold text-3xl flex justify-center -translate-y-8">พายุฤดูร้อน</div>
                    <div className="font-bold text-xl flex justify-center bg-grayFX rounded-lg p-3">
                        ช่องพิเศษทำงาน
                    </div>
                </div>
                <div>
                    <Image src={'/image/boardFX/boardFX1.svg'} alt=""  width={240} height={280} className={`relative`} />
                    <div className="text-white font-bold text-3xl flex justify-center -translate-y-8">พายุฤดูร้อน</div>
                </div>
                <div className="text-white font-bold text-xl flex justify-center -translate-y-8">รีเซ็ตกระดานทั้งหมด</div>
            </div>
        </div>
    )
}

export default ModalFX;