import React from 'react'
import Banner from './Banner'
import Categories from './Categories';
import HeroSection from './HeroSection';

const Home = () => {
  return (
    <div className='relative'>
      <Banner/>
      <Categories/>
      <HeroSection/>
    </div>
  );
};

export default Home
