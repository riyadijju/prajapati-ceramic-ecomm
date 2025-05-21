import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
        'service_kq24z3m',          // your Service ID
        'template_1h5qd0b',         // your Template ID
        formData,
        'sXf2ZJQ2XcL6SDwtf'         // ✅ your real Public Key
      )
    .then((result) => {
        toast.success('Message sent successfully!', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          
      setFormData({ name: '', email: '', message: '' });
    })
    .catch((error) => {
      console.error('Email error:', error);
      alert('Failed to send message.');
    });
  };

  return (
    <section className='section__container py-12 px-6 md:px-16'>
      <h2 className='text-3xl font-bold text-[#6b4c3b] mb-8 text-center'>Get in Touch</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        <div>
          <h3 className='text-xl font-semibold text-[#6b4c3b] mb-4'>Contact Information</h3>
          <p className='text-gray-700 mb-2'>📍 <strong>Address:</strong> 44600, Boudha Marg, Kathmandu, Nepal</p>
          <p className='text-gray-700 mb-2'>📧 <strong>Email:</strong> prajapaticeramics@gmail.com</p>
          <p className='text-gray-700 mb-2'>📞 <strong>Phone:</strong> (+977) 9869421616</p>
          <p className='text-gray-600 mt-4'>We're happy to help with any questions about our handmade ceramics.</p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white p-6 shadow-md rounded-md space-y-4'>
          <div>
            <label className='block mb-1 text-sm text-[#6b4c3b] font-medium'>Name</label>
            <input type='text' name='name' value={formData.name} onChange={handleChange} required
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a07d68]' />
          </div>
          <div>
            <label className='block mb-1 text-sm text-[#6b4c3b] font-medium'>Email</label>
            <input type='email' name='email' value={formData.email} onChange={handleChange} required
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a07d68]' />
          </div>
          <div>
            <label className='block mb-1 text-sm text-[#6b4c3b] font-medium'>Message</label>
            <textarea name='message' value={formData.message} onChange={handleChange} rows='4' required
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a07d68]'></textarea>
          </div>
          <button type='submit' className='bg-[#6b4c3b] text-white px-6 py-2 rounded hover:bg-[#8b5e3c] transition-colors duration-300'>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
