import React from 'react'
import { useAuth } from '@/app/hooks/useAuth';

const WelcomeCard = () => {
  const {user} = useAuth();
  return (
    <div className='text-white sudo flex flex-col justify-center items-start w-full bg-red-500 rounded-lg p-5'>
      <h2 className='text-sm'>Welcome back,</h2>
      <h1 className='text-lg'>{user?.firstName} {user?.lastName}</h1>
    </div>
  )
}

export default WelcomeCard
