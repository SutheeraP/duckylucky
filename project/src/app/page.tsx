'use client';
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

// const auth = getAuth();
// const user = auth.currentUser;
// if (user !== null) {
//   console.log(user)
//   // The user object has basic properties such as display name, email, etc.
//   const displayName = user.displayName;
//   const email = user.email;
//   const photoURL = user.photoURL;
//   const emailVerified = user.emailVerified;

//   // The user's ID, unique to the Firebase project. Do NOT use
//   // this value to authenticate with your backend server, if
//   // you have one. Use User.getToken() instead.
//   const uid = user.uid;
// }

// import {getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
// const auth = getAuth();
export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  })

  // let readUser = () => {
  //   const db = getDatabase();
  //   const starCountRef = ref(db, `UserList/${user.uid}`);
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val();
  //   });
  // }


  return (
    <main className="min-h-screen flex-col items-center justify-between p-24">
      <div className="container px-4">
        <div>
          <div>email : {session?.data?.user?.email}</div>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      </div>
    </main>
  );
}

Home.requireAuth = true
