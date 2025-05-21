import React from 'react'
import { Link } from 'react-router-dom';
import bannerImg from "../../assets/PC-main.png";


const Banner = () => {
  return (
    <div className='header__container  relative'>
      <div className='header__content z-30  absolute top-0 !h-[calc(100%-380px)] flex flex-col items-center justify-center !p-0 !px-[2rem]'>
        <h4>Handmade in Nepal</h4>
        <h1>Explore the Artistic 
            <br/>Legacy of Prajapati Community</h1>
            <button className='btn hover:bg-[#A47551] transition-colors duration-300'>
    <Link to='/shop'>SHOP NOW</Link>  
</button>

      </div>
      <div className='header__image'>
         <img src={bannerImg} alt='cover page' />
      </div>

    </div>
  )
}

export default Banner
