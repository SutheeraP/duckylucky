import Image from "next/image";

const ModalFX = (props:any) => {
    // const {selectedCard, resetSelectedCard, inhandCard} = props

    return(
        <div className="flex bg-black bg-opacity-50 justify-center w-screen z-30 h-screen absolute top-0">
            <div className="flex flex-col absolute top-1/4 ">
                <div className="font-bold text-xl flex justify-center">ช่องพิเศษทำงาน</div>
                <div>
                <Image src={'/image/boardFX/boardFX1.svg'} alt=""  width={280} height={280} className={`relative`} />
                <div className="text-white font-bold text-3xl flex justify-center -translate-y-8">พายุฤดูร้อน</div>
                </div>
                <div className="text-white font-bold text-xl flex justify-center">รีเซ็ตกระดานทั้งหมด</div>
            </div>
        </div>
    )
}

export default ModalFX;