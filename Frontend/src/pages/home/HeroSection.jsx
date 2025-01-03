import React from 'react'
import budh from "../../assets/budh.png"



import card1 from "../../assets/card-1.png"
import card2 from "../../assets/card-2.png"
import card3 from "../../assets/card-3.png"

// const cards =[
//     { 
//         id:1,
//         image: card1,
//         trend: '2025 Trend',
//         title: 'Gautam Buddha Statue'
//     },
//     { 
//         id:2,
//         image: card2,
//         trend: '2025 Trend',
//         title: 'Home Decor'
//     },
//     { 
//         id:3,
//         image: card3,
//         trend: '2025 Trend',
//         title: 'Gautam Buddha Statue'
//     }

// ]
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
