import Image from "next/image";
import { useState } from "react";

const Card = (props:any) => {
    const { idx, id, name, point, img, description, selectedCard, setSelectedCard } = props;
    // const [isSelected, setIsSelected] = useState(false)

    const handleClick = () => {
        setSelectedCard(idx)
    }

    return <Image src={img} alt=""  width={140} height={280} className={`relative -ml-46 left-23 border rounded-lg ${selectedCard === ``? 'translate-y-0 border-black':selectedCard === idx? 'translate-y-0 border-yellow-500':'translate-y-4 border-black'}`} onClick={() => {handleClick()}}/>
}
// ${selectedCard.key == key? '-translate-y-4':'translate-y-0'}

export default Card;