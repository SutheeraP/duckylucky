"use client"

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';

const WaitingRoom =():any =>{
    const router = useRouter();
       
    useEffect(() => {
        router.push('/')
        console.log('hi')
      },[]);
    return(
        <h1>eiei</h1>
    )
}
 
export default WaitingRoom  