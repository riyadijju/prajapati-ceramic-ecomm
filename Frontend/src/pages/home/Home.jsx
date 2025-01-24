import React from 'react'
import Banner from './Banner'
import Categories from './Categories';
import HeroSection from './HeroSection';
import PromoBanner from './PromoBanner';
import Blogs from '../blogs/Blogs';
// import TrendingProducts from '../shop/TrendingProducts';

const Home = () => {
  return (
    <>
    <div className='relative'>
      <Banner/>
      <Categories/>
    </div>
      <HeroSection/>
      {/* <TrendingProducts/> */}
      
      <Blogs/>
      <PromoBanner/>
    </>
  );
};

export default Home
