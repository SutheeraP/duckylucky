import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth } from "firebase/auth";
import { auth } from "@/app/firebase";

export const authOptions ={
    pages: {
        signIn: '/signin'
    },
    providers: [
        CredentialsProvider({
            name: 'Caredentials',
            credentials: {},
            async authorize(credentials): Promise<any> {
                return await signInWithEmailAndPassword(auth, (credentials as any).email || '', (credentials as any).password || '')
                .then(userCredential => {
                    if(userCredential.user){
                        return userCredential.user;
                    }
                    return null;
                })
                .catch(error => (console.log(error))) 
            }
        })
    ]
}