import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditProfileMutation } from '../../../redux/features/auth/authApi';

import avatarImg from '../../../assets/avatar.png';
import { setUser } from '../../../redux/features/auth/authSlice';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [editProfile, { isLoading, isError, error, isSuccess }] = useEditProfileMutation();

    const [formData, setformData] = useState({
        username: '',
        profileImage: '',
        bio: '',
        profession: '',
        userId: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setformData({
                username: user?.username || '',
                profileImage: user?.profileImage || '',
                bio: user?.bio || '',
                profession: user?.profession || '',
                userId: user?._id || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = {
            username: formData.username,
            profileImage: formData.profileImage,
            bio: formData.bio,
            profession: formData.profession,
            userId: formData.userId
        };
        try {
            const response = await editProfile(updatedUser).unwrap();
            dispatch(setUser(response.user));
            localStorage.setItem('user', JSON.stringify(response.user));
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again");
        }
        setIsModalOpen(false);
    };

    return (
        <div className='container mx-auto p-6'>
            <div className='bg-white shadow-lg rounded-xl p-6 border border-[#eaeaea]'>
                <div className='flex flex-col md:flex-row items-center gap-6'>
                    <img src={formData?.profileImage || avatarImg} alt="avatar" className='w-32 h-32 object-cover rounded-full border-4 border-[#683a3a]' />
                    <div className='flex-1 space-y-2 text-center md:text-left'>
                        <h3 className='text-3xl font-bold text-[#683a3a]'>{formData?.username || 'N/A'}</h3>
                        <p className='text-gray-600'><span className="font-semibold">Bio:</span> {formData.bio || 'N/A'}</p>
                        <p className='text-gray-600'><span className="font-semibold">Profession:</span> {formData.profession || 'N/A'}</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-[#683a3a] text-white px-4 py-2 rounded-lg hover:bg-[#562e2e] transition-colors'>
                        Edit Profile
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative'>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className='absolute top-2 right-2 text-gray-500 hover:text-[#683a3a]'>
                            <i className="ri-close-line text-2xl"></i>
                        </button>
                        <h2 className='text-2xl font-bold mb-4 text-[#683a3a]'>Edit Profile</h2>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Username</label>
                                <input type="text" name='username' value={formData?.username} onChange={handleChange}
                                    className='mt-1 p-2 w-full border rounded-md focus:ring-[#683a3a] focus:border-[#683a3a]' required />
                            </div>
                            <div>
                                <label htmlFor="profileImage" className='block text-sm font-medium text-gray-700'>Profile Image URL</label>
                                <input type="text" name='profileImage' value={formData?.profileImage} onChange={handleChange}
                                    className='mt-1 p-2 w-full border rounded-md focus:ring-[#683a3a] focus:border-[#683a3a]' required />
                            </div>
                            <div>
                                <label htmlFor="bio" className='block text-sm font-medium text-gray-700'>Bio</label>
                                <textarea name='bio' rows="3" value={formData?.bio} onChange={handleChange}
                                    className='mt-1 p-2 w-full border rounded-md focus:ring-[#683a3a] focus:border-[#683a3a]'></textarea>
                            </div>
                            <div>
                                <label htmlFor="profession" className='block text-sm font-medium text-gray-700'>Profession</label>
                                <input type="text" name='profession' value={formData?.profession} onChange={handleChange}
                                    className='mt-1 p-2 w-full border rounded-md focus:ring-[#683a3a] focus:border-[#683a3a]' required />
                            </div>
                            <button type='submit'
                                className={`w-full bg-[#683a3a] text-white py-2 rounded-md hover:bg-[#562e2e] transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            {isError && <p className='text-red-600 mt-2'>Failed to update profile. Please try again.</p>}
                            {isSuccess && <p className='text-green-600 mt-2'>Profile updated successfully!</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
