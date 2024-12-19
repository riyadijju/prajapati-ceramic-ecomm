import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='fixed-nav-bar w-nav'>  
    <nav className ='max-w-screen-2xl mx-auto px-4 flex justify-between items-center'>
        <ul className='nav__links'>
         
         {/* NAV HEADS */}

        <li> <Link to="/">Home</Link> </li>
        <li> <Link to="/shop">Shop</Link> </li>
        <li> <Link to="/blogs">Blogs</Link> </li>
        <li> <Link to="/contact">Contact Us</Link> </li>

        </ul>
        {/*  LOGO */}
        <div className='nav__logo'> 
          <Link to="/">
            <img src="/prajapati logo.png" alt="Prajapati Ceramic Logo" className="w-24 h-auto" />
          </Link>
        </div>

        {/* NAV ICONS */}
        <div className='nav__icons relative'>

          {/* -------Search Button---------- */}
          <span>
            <Link to ="/search" >
              <i className="ri-search-line"></i>
            </Link>
          </span> 

          {/* -------Cart Button---------- */}
          <span>
            <button className='hover:text-primary'>
              <i className="ri-shopping-cart-line"></i>
              <sup className='text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center'>0</sup>
            </button>
          </span>
          {/* -------User Button--------- */}
          <span>
            <Link to="login">
            <i class="ri-user-6-line"></i>
            </Link>
          </span>


          </div>

    </nav>
    </header>
  )
}

export default Navbar
// rafce