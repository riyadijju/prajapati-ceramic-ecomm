import React from 'react'
import Banner from './Banner'
import Categories from './Categories';
import HeroSection from './HeroSection';
import PromoBanner from './PromoBanner';
import Blogs from '../blogs/Blogs';

const Home = () => {
  return (
    <>
    <div className='relative'>
      <Banner/>
      <Categories/>
    </div>
      <HeroSection/>
      <PromoBanner/>
      <Blogs/>
    </>
  );
};

export default Home
