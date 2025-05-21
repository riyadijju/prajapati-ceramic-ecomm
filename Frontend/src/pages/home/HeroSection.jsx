import React from 'react'
import budh from "../../assets/budh.png"

const HeroSection = () => {
  return (
    <section className='section__container relative  !px-[4.5rem]'>
        <div className='bg-[#683A3A] grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 grid-rows-[auto,1fr]'>
          {/* Image first on mobile, second on desktop */}
<figure className="order-1 lg:order-2 size-full">
  <img className="object-center object-cover size-full" src={budh} alt="A picture of the statue" />
</figure>

{/* Text second on mobile, first on desktop */}
<div className="order-2 lg:order-1 flex flex-col gap-[48px] justify-between items-center px-[24px] py-[40px] lg:px-[94px] lg:py-[74px]">
  <h2 className="text-white text-center uppercase font-bold text-3xl">
    Up to 40% off our Best Selling collection
  </h2>
  <p className="text-white text-[16px] font-normal text-center leading-[1.8]">
    Explore Buddha Statues, Mugs, and Vases at DISCOUNTED prices.
    Elevate your space with grace and style.
  </p>
  <a href="/shop" className="text-white underline font-semibold uppercase p-4">
    shop now
  </a>
</div>
        </div>
    </section>
  )
}

export default HeroSection
