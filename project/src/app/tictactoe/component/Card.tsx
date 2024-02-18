import Image from "next/image";
import { useState } from "react";

const Card = (props:any) => {
    const { key, id, name, point, img, description, selectedCard, setSelectedCard } = props;
    // const [isSelected, setIsSelected] = useState(false)

    const handleClick = () => {
        // setSelectedCard({ key: key, id: id })
        setSelectedCard(id)
        // setIsSelected(true)
    }

    return <Image key={key} src={img} alt=""  width={140} height={280} className={`relative -ml-46 left-23 border border-black rounded-lg`} onClick={handleClick}/>
}
// ${selectedCard.key == key? '-translate-y-4':'translate-y-0'}

export default Card;