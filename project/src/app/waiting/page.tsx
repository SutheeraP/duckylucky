"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

const waiting =():any =>{
    const session = useSession({
        required: true,
        onUnauthenticated() {
          redirect('/signin');
        },
      })
    return(
        <>
            <h1>hii</h1>
        </>
    )
}
 
export default waiting
 
waiting.auth = true