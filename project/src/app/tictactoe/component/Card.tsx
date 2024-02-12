"use client";
import { useState } from "react"


const Card = () => {

    interface CardData {
        [key: string]: any;
    }
    const [cardData, setCardData] = useState<CardData>({
        0:`t`,
        1:`e`, 
        2:``, 
        3:`t`, 
        4:`#>`, 
        5:`<#`, 
    });

    const insertCard = (cardID: string) => {
        Object.entries(cardData).every(([key, value]) => {
            console.log(`${value}`);
            if (`${value}` == ``){
                setCardData({...cardData, [`${key}`]: cardID});
                console.log(`${value}`)
                return false;
            }
            else{
                return true;
            }
        });
    }

    const [selectedCard, setSelectedCard] = useState('')
    
    const removeCard = (idx: number) => {
        setCardData({...cardData, [`${selectedCard}`]: ``});
    }

    return(
        <div id="userCardContainer" className="container mx-auto flex justify-center relative">
            {[...Array(6)].map((v, idx: number) => {
                return <div key={idx} className={`w-40 h-60 bg-black rounded-lg border border-white relative -ml-32 left-16 ${cardData[idx]? 'block' : 'hidden'}`} onClick={() => {setSelectedCard(`${idx}`)}}>
                </div>
            })}
            <div className="bg-slate-300 rounded-lg flex w-28 p-2 justify-center items-center cursor-pointer" onClick={() => {insertCard('test')}}>insertcard</div>
        </div>
    )
}

export default Card;