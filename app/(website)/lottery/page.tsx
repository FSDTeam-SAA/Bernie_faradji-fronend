import React from 'react'
import GrabToken from './_components/GrabTokenv'
import Hero from '@/components/Homepage_Components/Hero'

const page = () => {
  return (
    <div>

      <Hero
        heading="Get Your Tokens Here"
        description="Enter our exclusive monthly Insurance by purchasing entry tokens. Win amazing Insurance!"
        imageSrc="/lottery.png"
      
      />
      <GrabToken />
    </div>
  )
}

export default page
