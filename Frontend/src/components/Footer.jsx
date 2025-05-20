import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import instaImg1 from "../assets/instagram-1.png";
import instaImg2 from "../assets/instagram-2.png";
import instaImg3 from "../assets/instagram-3.png";
import instaImg4 from "../assets/instagram-4.png";
import instaImg5 from "../assets/instagram-5.png";
import instaImg6 from "../assets/instagram-6.png";

const Footer = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    if (user) {
      navigate("/dashboard/orders");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <footer className="section__container px-4 py-12 bg-[#ffffff] text-[#3c2f25]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">CONTACT INFO</h4>
            <p className="mb-2">
              <i className="ri-map-pin-2-fill mr-2 text-[#8B5E3C]"></i>
              <a
                href="https://g.co/kgs/WLV7oCL"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8B5E3C] transition-colors"
              >
                44600, Boudha Marg, Kathmandu, Nepal
              </a>
            </p>
            <p className="mb-2">
              <i className="ri-mail-fill mr-2 text-[#8B5E3C]"></i>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=prajapaticeramics@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8B5E3C] transition-colors"
              >
                prajapaticeramics@gmail.com
              </a>
            </p>
            <p>
              <i className="ri-phone-fill mr-2 text-[#8B5E3C]"></i>
              <a
                href="tel:+9779869421616"
                className="hover:text-[#8B5E3C] transition-colors"
              >
                (+977) 9869421616
              </a>
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">COMPANY</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="/" className="hover:text-[#8B5E3C] transition-colors">Home</a>
              <a href="/" className="hover:text-[#8B5E3C] transition-colors">About Us</a>
              <a href="/" className="hover:text-[#8B5E3C] transition-colors">Our Blogs</a>
              <a href="/" className="hover:text-[#8B5E3C] transition-colors">Terms & Conditions</a>
            </div>
          </div>

          {/* Useful Link */}
          <div>
            <h4 className="text-lg font-semibold mb-4">USEFUL LINK</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="/" className="hover:text-[#8B5E3C] transition-colors">Help</a>
              <button
                onClick={handleTrackOrder}
                className="text-left hover:text-[#8B5E3C] transition-colors"
              >
                Track your order
              </button>
              <a href="http://localhost:5173/categories/holiday" className="hover:text-[#8B5E3C] transition-colors">Holiday</a>
              <a href="http://localhost:5173/categories/tableware" className="hover:text-[#8B5E3C] transition-colors">Tableware</a>
              <a href="http://localhost:5173/categories/dinnerware" className="hover:text-[#8B5E3C] transition-colors">Dinnerware</a>
            </div>
          </div>

          {/* Instagram Grid */}
          <a
            href="https://www.instagram.com/prajapaticeramic/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-90 transition-opacity duration-200"
          >
            <div>
              <h4 className="text-lg font-semibold mb-4">INSTAGRAM</h4>
              <div className="grid grid-cols-3 gap-2">
                <img src={instaImg1} alt="insta-1" className="w-20 h-20 object-cover rounded" />
                <img src={instaImg2} alt="insta-2" className="w-20 h-20 object-cover rounded" />
                <img src={instaImg3} alt="insta-3" className="w-20 h-20 object-cover rounded" />
                <img src={instaImg4} alt="insta-4" className="w-20 h-20 object-cover rounded" />
                <img src={instaImg5} alt="insta-5" className="w-20 h-20 object-cover rounded" />
                <img src={instaImg6} alt="insta-6" className="w-20 h-20 object-cover rounded" />
              </div>
            </div>
          </a>
        </div>
      </footer>

      <div className="bg-[#e9e5dc] text-center py-4 text-sm text-[#5D4F3B]">
        Copyright © 2025 by Prajapati Ceramic. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
