import React from 'react'


const PromoBanner = () => {
  return (
    <section className='section__container banner__container'>
        <div className='banner__card'>
           <span> <i className="ri-truck-line"></i></span>
           <h4>Free Deliver</h4>
           <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe, eveniet facilis quo eum quam fugiat incidunt</p>
        </div>    
        <div className='banner__card'>
           <span> <i className="ri-money-dollar-circle-line"></i></span>
           <h4>100% Money Back Guarantee</h4>
           <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe, eveniet facilis quo eum quam fugiat incidunt</p>
        </div>   
        <div className='banner__card'>
           <span> <i className="ri-customer-service-2-line"></i></span>
           <h4>Strong Customar Support</h4>
           <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe, eveniet facilis quo eum quam fugiat incidunt</p>
        </div>   
    </section>
  )
}

export default PromoBanner
