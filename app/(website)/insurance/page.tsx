import Hero from '@/components/Homepage_Components/Hero'
import React from 'react'
import InsuranceListing from './_components/InsuranceListing'

const page = () => {
  return (
    <div>
      <Hero
        heading="Special Insurance " 
        description="Enter our exclusive monthly Insurance by purchasing entry tokens. Win amazing Insurance!"
        imageSrc="/insurancebg.png"
      
      />
      <InsuranceListing/>
    </div>
  )
}

export default page
