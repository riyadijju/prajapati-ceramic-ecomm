import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='fixed-nav-bar w-nav'>  
    <nav className ='max-w-screen-2xl mx-auto px-4 flex justify-between items-center'>
        <ul className='nav__links'>
         
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
    </nav>
    </header>
  )
}

export default Navbar
// rafce