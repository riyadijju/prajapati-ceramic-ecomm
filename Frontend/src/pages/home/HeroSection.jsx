import React from 'react'
import budh from "../../assets/budh.png"

const HeroSection = () => {
  return (
    <section className='section__container relative w-[80%] !px-[4.5rem]'>
        <div className='bg-[#683A3A] grid grid-cols-2'>
            <div className='flex flex-col gap-[48px] justify-between items-center px-[94px] py-[74px]'>
                <h2 className='text-white text-center uppercase font-bold text-3xl'>Up to 40% off our Best Selling collection</h2>
                <p className='text-white text-[16px] font-normal text-center leading-[1.8]'>Explore Buddha Statues, Mugs, and Vases 
                        at DISCOUNTED prices. 
                        Elevate your space with grace and style. </p>
                        <a href="/shop" className='text-white underline font-semibold uppercase p-4'>shop now</a>
                </div>
                <figure className='size-full'>
                    <img className='object-center object-cover size-full' src={budh} alt="A picture of the statue" />


                </figure>
        </div>
    </section>
  )
}

export default HeroSection
