import React from 'react'
import {FaTwitter} from 'react-icons/fa'
import Image from 'next/image'

type Props = {}

const LoadingComponent = (props: Props) => {
  return (
    <div className='flex h-screen z-10 justify-center items-center'>
        <Image src='/x-icon.png' alt='' width={25} height={25}/>
    </div>
  )
}

export default LoadingComponent