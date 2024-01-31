'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <div className='text-primary min-h-screen flex flex-col items-center justify-center'>
      <form className="flex flex-col gap-4" action="#">
        <input className='px-3 py-2 rounded-md ring-1 ring-black' type="text" name="username" id="username" required placeholder='ชื่อผู้ใช้งาน' />
        <input className='p-2' type="text" name="password" id="password" required placeholder='ชื่อผู้ใช้งาน' />
        <div className='flex justify-between'>
          <button className='' onClick={() => signIn('credentials', { email, password, redirect: true, callbackUrl: '/' })}>SignIn</button>
          <button onClick={() => router.push('signup')}>Sign up</button>
        </div>
      </form>
    </div>

  )
}
