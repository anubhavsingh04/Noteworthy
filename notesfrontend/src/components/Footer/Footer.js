import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/10 py-8 relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Main footer content */}
        <div className="flex lg:flex-row flex-col lg:gap-0 gap-8 justify-between items-center">
          
          {/* Navigation Links - Left Section */}
          <ul className="flex flex-1 md:gap-6 gap-4 text-slate-300 flex-row items-center lg:justify-start justify-center flex-wrap">
            <li>
              <Link 
                to="/about" 
                className="hover:text-white hover:underline underline-offset-4 transition-colors duration-300 text-sm font-medium"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/" 
                className="hover:text-white hover:underline underline-offset-4 transition-colors duration-300 text-sm font-medium"
              >
                Services
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="hover:text-white hover:underline underline-offset-4 transition-colors duration-300 text-sm font-medium"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                to="/" 
                className="hover:text-white hover:underline underline-offset-4 transition-colors duration-300 text-sm font-medium"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>

          {/* Copyright - Center Section */}
          <p className="w-fit flex items-center text-slate-300 text-sm font-medium px-4 text-center lg:order-2 order-1">
            <span>&copy;{currentYear} Noteworthy | All rights reserved.</span>
          </p>

          {/* Social Links - Right Section */}
          <div className="flex-1 flex flex-row gap-4 lg:justify-end justify-center items-center lg:order-3 order-2">
            <Link
              className="text-white h-10 w-10 flex justify-center items-center rounded-full p-2 bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600/50 hover:scale-105 transition-all duration-300"
              to="https://www.facebook.com/people/Anubhav-Singh-Rajput/100058448296720/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="w-4 h-4" />
            </Link>
            <Link
              className="text-white h-10 w-10 flex justify-center items-center rounded-full p-2 bg-white/5 border border-white/10 hover:bg-blue-700 hover:border-blue-700/50 hover:scale-105 transition-all duration-300"
              to="https://www.linkedin.com/in/anubhavsingh07/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </Link>
            <Link
              className="text-white h-10 w-10 flex justify-center items-center rounded-full p-2 bg-white/5 border border-white/10 hover:bg-sky-500 hover:border-sky-500/50 hover:scale-105 transition-all duration-300"
              to="https://twitter.com/anubhavsingh04"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="w-4 h-4" />
            </Link>
            <Link
              className="text-white h-10 w-10 flex justify-center items-center rounded-full p-2 bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-pink-600 hover:to-purple-600 hover:border-pink-500/50 hover:scale-105 transition-all duration-300"
              to="https://www.instagram.com/anubhav_singh_07/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 text-center">
          <p className="text-slate-300 text-sm">
            Developed with ❤️ by Anubhav Singh | Version 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;