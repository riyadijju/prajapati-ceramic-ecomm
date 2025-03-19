import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

const Navbar = () => {

      const products = useSelector((state) => state.cart.products);    
      console.log(products)
    


  return (
    <header className='fixed-nav-bar w-nav'>  
      <nav className='max-w-screen-2xl mx-auto px-4 flex items-center'>
        {/* LOGO */}
        <div className='nav__logo flex-1 text-center'>
          <Link to="/">
            <img src="/prajapati logo.png" alt="Prajapati Ceramic Logo" className="w-24 h-auto" />
          </Link>
        </div>

        {/* NAV LINKS */}
        <ul className='nav__links flex-1 flex justify-center space-x-2'>
          <li className='link'><Link to="/">Home</Link></li>
          <li className='link'><Link to="/shop">Shop</Link></li>
          <li className='link'><Link to="/about">About</Link></li>
          <li className='link'><Link to="/contact">Contact</Link></li>
        </ul>

        {/* NAV ICONS */}
        <div className='nav__icons flex-1 flex justify-end items-center space-x--2'>
          <span>
            <Link to="/search">
              <i className="ri-search-line"></i>
            </Link>
          </span> 
          <span>
            <button className='hover:text-primary'>
              <i className="ri-shopping-cart-line"></i>
              <sup className='text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center'>{products.length}</sup>
            </button>
          </span>
          <span>
            <Link to="/login">
              <i className="ri-user-6-line"></i>
            </Link>
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
