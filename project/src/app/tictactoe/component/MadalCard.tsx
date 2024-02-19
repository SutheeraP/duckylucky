import Image from "next/image";

const ModalCard = (props:any) => {
    const {selectedCard, inhandCard} = props
    return(
        <div className="flex flex-row">
            <Image src={inhandCard[selectedCard].img} alt=""  width={140} height={280}></Image>
            <div className="">
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default ModalCard;