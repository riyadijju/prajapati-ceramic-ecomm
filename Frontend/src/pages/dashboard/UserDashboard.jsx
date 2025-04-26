import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/dashboard/orders', label: 'Order' },
  { path: '/dashboard/payments', label: 'Payments' },
  { path: '/dashboard/profile', label: 'Profile' },
  { path: '/dashboard/reviews', label: 'Reviews' },
];

const UserDashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsConfirmLogoutOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success('Logout successful');
      navigate('/');
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

  const handleCancelLogout = () => {
    setIsConfirmLogoutOpen(false);
  };

  return (
    <div className='space-y-5 bg-white p-8 md:h-screen flex flex-col justify-between relative'>
      <div>
        <div className='nav__logo'>
          <Link to="/">
            <img src="/prajapati logo.png" alt="Prajapati Ceramic Logo" className="w-24 h-auto" />
          </Link>
        </div>
        <hr className='mt-5' />
        <ul className='space-y-5 pt-5'>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                className={({ isActive }) => isActive ? "text-blue-600 font-bold" : 'text-black'}
                end
                to={item.path}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className='mb-3'>
        <hr className='mb-3'/>
        <button 
          onClick={handleLogoutClick}
          className='text-white bg-green-900 font-medium px-5 py-1 rounded-sm'
        >
          Logout
        </button>
      </div>

      {/* Confirm Logout Modal */}
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
    </div>
  );
};

export default UserDashboard;
