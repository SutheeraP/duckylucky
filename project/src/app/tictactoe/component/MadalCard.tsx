import Image from "next/image";

const ModalCard = (props:any) => {
    const {selectedCard, resetSelectedCard, inhandCard} = props

    return(
        <div className="flex flex-row border border-black rounded-lg px-6 py-4 gap-6 relative">
            {!(selectedCard === ``)? <Image src={inhandCard[selectedCard].img} alt=""  width={130} height={280} className="border border-black rounded-lg"></Image> : ''}
            <div className="flex flex-col justify-center items-center w-full text-center mx-auto">
                <div className="text-md font-black">{!(selectedCard === ``)? `${inhandCard[selectedCard].name}`:''}</div>
                <div className="text-sm">{!(selectedCard === ``)? ` ${inhandCard[selectedCard].description}`:''}</div>
            </div>
            <div className="absolute top-4 right-4 w-7 h-7 bg-black rounded-full text-white text-lg font-semibold flex justify-center items-center" onClick={() => {resetSelectedCard()}}>x</div>
        </div>
    )
}

export default ModalCard;