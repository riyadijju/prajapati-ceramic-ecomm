import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify'; // Import the toast function

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

    const handleLogout = async () => {
        try {
            // Ensure user is logged in before attempting to logout
            const response = await logoutUser().unwrap();
            dispatch(logout());
            toast.success('Logout successful'); // Show success message
            navigate('/');
        } catch (error) {
            console.error('Failed to log out', error);
            
            // Error handling based on the type of error response
            if (error?.message === 'You must be logged in!') {
                toast.error('You are already logged out!'); // Show specific error message
            } else {
                toast.error('Logout failed. Please try again.'); // Show general error message
            }
        }
    };

    return (
        <div className='space-y-5 bg-white p-8 md:h-screen flex flex-col justify-between'>
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
                                className={({isActive}) => isActive ? "text-blue-600 font-bold" : 'text-black'} 
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
                    onClick={handleLogout}
                    className='text-white bg-green-900 font-medium px-5 py-1 rounded-sm'>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
