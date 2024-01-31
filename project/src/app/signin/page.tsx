'use client';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
    return (
    <div>page</div>
  )
}
