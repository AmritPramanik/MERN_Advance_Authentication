import React from 'react'
import Navber from '../components/Navber'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-center bg-cover'>
      <Navber/>
      <Header/>
    </div>
  )
}

export default Home
