"use client";
import Image from "next/image";
import Card from "./Card"
import { useState } from "react"


const CardLayout = (props:any) => {

    const { card, inhandCard, selectedCard, setSelectedCard } = props;

    return(
        <div className="flex flex-col justify-center align-middle gap-4">
            <div id="userCardContainer" className="container mx-auto flex justify-center relative">
                {inhandCard.map((element:any, idx:number) => {
                    return <Card key={idx} {...element} selectedCard={selectedCard} setSelectedCard={setSelectedCard}/>
                })}
            </div>
        </div>

    )
}

export default CardLayout;