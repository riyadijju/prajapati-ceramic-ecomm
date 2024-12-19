import React from 'react'
import { Link } from 'react-router-dom';
import bannerImg from "../../assets/PC-main.png";


const Banner = () => {
  return (
    <div className='section__container header__container'>
      <div className='header__content z-30'>
        <h4>Handmade in Nepal</h4>
        <h1>Explore the Artistic 
            <br/>Legacy of Prajapati Community</h1>
            <button className='btn'>
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
