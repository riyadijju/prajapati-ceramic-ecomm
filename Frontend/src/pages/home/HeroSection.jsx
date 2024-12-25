import React from 'react'

import card1 from "../../assets/card-1.png"
import card2 from "../../assets/card-2.png"
import card3 from "../../assets/card-3.png"

const cards =[
    { 
        id:1,
        image: card1,
        trend: '2025 Trend',
        title: 'Gautam Buddha Statue'
    },
    { 
        id:2,
        image: card2,
        trend: '2025 Trend',
        title: 'Home Decor'
    },
    { 
        id:3,
        image: card3,
        trend: '2025 Trend',
        title: 'Gautam Buddha Statue'
    }

]
const HeroSection = () => {
  return (
    <section className='section__container hero__container'>
        {
            cards.map((card)=>(
                <div key={card.id} className='hero__card'>
                    <img src={card.image} alt= ""/>

                </div>
            ))

        }

    </section>
  )
}

export default HeroSection
