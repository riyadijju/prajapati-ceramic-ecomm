import React from 'react'
import Banner from './Banner'
import Categories from './Categories';

const Home = () => {
  return (
    <div className='relative'>
      <Banner/>
      {/* <section className='p-8'> */}
      <Categories/>
      {/* </section> */}
    </div>
  );
};

export default Home
