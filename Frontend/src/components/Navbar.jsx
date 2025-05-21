import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png";
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';
import { clearCart } from '../redux/features/cart/cartSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.cart.products);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const adminDropDownMenus = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Items", path: "/dashboard/manage-products" },
    { label: "All Orders", path: "/dashboard/manage-orders" },
    { label: "Add Product", path: "/dashboard/add-product" },
  ];

  const userDropDownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Payments", path: "/dashboard/payments" },
    { label: "Orders", path: "/dashboard/orders" },
  ];

  const dropdownMenus = user?.role === 'admin' ? adminDropDownMenus : userDropDownMenus;

  const handleCartToggle = () => setIsCartOpen(prev => !prev);
  const handleDropDownToggle = () => setIsDropDownOpen(prev => !prev);
  const handleLogoutClick = () => {
    setIsConfirmLogoutOpen(true);
    setIsDropDownOpen(false);
  };
  const handleCancelLogout = () => setIsConfirmLogoutOpen(false);

  const handleConfirmLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      dispatch(clearCart());
      toast.success('Logout successful');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);

      if (error?.data?.message === 'You must be logged in!') {
        dispatch(logout());
        navigate('/login');
        toast.info('Session expired, please login again.');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } finally {
      setIsConfirmLogoutOpen(false);
    }
  };

  return (
    <header className="fixed-nav-bar w-nav">
      <nav className="max-w-screen-2xl mx-auto px-4 flex items-center">
        {/* Logo */}
        <div className="nav__logo flex-1 text-center">
          <Link to="/">
            <img src="/prajapati logo.png" alt="Prajapati Ceramic Logo" className="w-24 h-auto" />
          </Link>
        </div>

        {/* Nav Links */}
        <ul className="nav__links flex-1 flex justify-center space-x-2">
          <li className="link"><Link to="/">Home</Link></li>
          <li className="link"><Link to="/shop">Shop</Link></li>
          <li className="link"><Link to="/about">About</Link></li>
          <li className="link"><Link to="/contact">Contact</Link></li>
        </ul>

        {/* Nav Icons */}
        <div className="nav__icons flex-1 flex justify-end items-center space-x-2">
          <span>
            <Link to="/search">
              <i className="ri-search-line"></i>
            </Link>
          </span>

          <span>
            <button onClick={handleCartToggle} className="hover:text-primary relative">
              <i className="ri-shopping-cart-line"></i>
              {products.length > 0 && (
                <sup className="text-sm px-1.5 text-white rounded-full bg-primary absolute -top-2 -right-2">
                  {products.length}
                </sup>
              )}
            </button>
          </span>

          <span>
            {user ? (
              <>
                <img
                  onClick={handleDropDownToggle}
                  src={user.profileImage || avatarImg}
                  alt="User Avatar"
                  className="size-6 rounded-full cursor-pointer"
                />

                {isDropDownOpen && (
                  <div className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="font-medium space-y-4 p-2">
                      {dropdownMenus.map((menu, index) => (
                        <li key={index}>
                          <Link
                            to={menu.path}
                            className="dropdown-items"
                            onClick={() => setIsDropDownOpen(false)}
                          >
                            {menu.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogoutClick}
                          className="dropdown-items text-left w-full"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <i className="ri-user-line"></i>
              </Link>
            )}
          </span>
        </div>
      </nav>

      {isCartOpen && (
        <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle} />
      )}

      {/* Logout Confirmation Modal */}
      {isConfirmLogoutOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-[#f9f5f0] p-8 rounded-2xl shadow-2xl text-center space-y-5 border border-[#d6c7b0] max-w-sm w-full">
            <h2 className="text-2xl font-bold text-[#5c3a21]">Confirm Logout</h2>
            <p className="text-[#7c5e44] text-base">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center space-x-6 pt-4">
              <button
                onClick={handleCancelLogout}
                className="px-5 py-2 rounded-lg bg-[#d6c7b0] hover:bg-[#c2b49d] text-[#5c3a21] font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-5 py-2 rounded-lg bg-[#a9744f] hover:bg-[#99694b] text-white font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
