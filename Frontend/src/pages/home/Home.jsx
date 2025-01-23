import React from 'react'
import Banner from './Banner'
import Categories from './Categories';
import HeroSection from './HeroSection';
import PromoBanner from './PromoBanner';

const Home = () => {
  return (
    <>
    <div className='relative'>
      <Banner/>
      <Categories/>
    </div>
      <HeroSection/>
      <PromoBanner/>
    </>
  );
};

export default Home
