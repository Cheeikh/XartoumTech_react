import React, { useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { FaCoins } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";

import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png";
import { ChevronDown, Settings } from 'lucide-react';

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    // Votre logique de recherche ici
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 px-4 bg-primary rounded-xl'>
      <Link to='/' className='flex gap-2 items-center'>
        <img src={LogoImage} alt="XartoumTech" className='h-10 md:h-16' />
      </Link>
      <form
        className='items-center justify-center hidden md:flex'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem] rounded-full py-3'
          register={register("search")}
        />
      </form>
      
      {/* PROFILE */}
      <div className='flex items-center gap-4 text-ascent-1 text-md md:text-xl'>
        {/* THEME */}
      <div className='flex items-center gap-1 text-ascent-1 text-md md:text-xl'>
        <button
          onClick={handleTheme}
          className='flex items-center focus:outline-none'
        >
          {theme === "light" ? <BsMoon size={20} /> : <BsSunFill size={20} />}
        </button>
      </div>
        <h2 className='text-xl text-[#71717a] '>Hello,</h2>
        {/* Profile name */}
        <h2 className='text-xl text-[#7e22ce] font-bold'>idrissa</h2>
        <div className='relative'>
          <button
            onClick={toggleDropdown}
            className='flex items-center focus:outline-none'
          >
            <img
              src={NoProfile}
              alt="Photo de profil"
              className='w-10 h-10 object-cover rounded-full'
            />
            <ChevronDown className='ml-1' size={20} />
          </button>
          {/* Dropdown Menu */}
          {isOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10'>
              <Link to='/profile' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                {/* Profile picture  and name */}
                <div className='flex items-center border-b-2 border-'>
                  <img
                    src={NoProfile}
                    alt="Photo de profil"
                    className='w-10 h-10 object-cover rounded-full'
                  />
                  <p className='ml-2'>idrissa</p>
                </div>
              </Link>
              <Link to='/settings' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
               {/* Notifications */}
                <div className='flex items-center'>
                  <IoNotifications size={20} />
                  <p className='ml-2'>Notifications</p>
                </div>
              </Link>
              <Link to='/messages' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                {/* Messages */}
                <div className='flex items-center'>
                  <AiOutlineMessage size={20} />
                  <p className='ml-2'>Messages</p>
                </div>
              </Link>
              <Link to='/chat' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                {/* Chat */}
                <div className='flex items-center'>
                  <FaCoins size={20} />
                  <p className='ml-2'>Get Coins</p>
                </div>
              </Link>
              <Link to='/settings' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                {/* Settings */}
                <div className='flex items-center'>
                  <Settings size={20} />
                  <p className='ml-2'>Settings</p>
                </div>
              </Link>
              <Link to='/settings' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                {/* Settings */}
                <div className='flex items-center'>
                  < IoMdLogOut size={20} />
                  <p className='ml-2'>Deconnexion</p>
                </div>
              </Link>
              
              
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default TopBar;