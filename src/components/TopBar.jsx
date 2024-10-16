import React, { useState, useRef, useEffect } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { IoChatbubbleEllipsesOutline, IoNotifications } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { FaCoins } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";

import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png";
import { ChevronDown, Settings } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown'; // Import ajouté

const TopBar = ({ user }) => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  // États pour gérer les dropdowns
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Références pour détecter les clics en dehors
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    // Votre logique de recherche ici
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Fermer les dropdowns lorsqu'un clic est détecté en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className='topbar w-full flex items-center justify-between py-3 px-4 bg-primary rounded-xl'>
        {/* Logo */}
        <Link to='/' className='flex gap-2 items-center'>
          <img src={LogoImage} alt="XartoumTech" className='h-10 md:h-16' />
        </Link>

        {/* Formulaire de recherche */}
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

        {/* Section Profil */}
        <div className='flex items-center gap-4 text-ascent-1 text-md md:text-xl'>
          {/* Bouton de thème */}
          <div>
            <button
                className='flex items-center focus:outline-none'
            >
              <NotificationDropdown/>
            </button>
          </div>
          <div className='flex items-center gap-1 text-ascent-1 text-md md:text-xl'>
            <button
                onClick={handleTheme}
                className='flex items-center focus:outline-none'
            >
              {theme === "light" ? <BsMoon size={20}/> : <BsSunFill size={20}/>}
            </button>

          </div>

          {/* Message de bienvenue */}
          <h2 className='text-xl text-[#71717a] '>Hello,</h2>
          {/* Nom de l'utilisateur */}
          <h2 className='text-xl text-[#7e22ce] font-bold'>
            {user?.user.firstName}
          </h2>

          {/* Dropdown Profil */}
          <div className='relative' ref={profileRef}>
            <button
                onClick={toggleProfileDropdown}
                className='flex items-center focus:outline-none'
            >
              <img
                  src={user?.user.profileUrl ?? NoProfile}
                  alt="Photo de profil"
                  className='w-10 h-10 object-cover rounded-full'
              />
              <ChevronDown className='ml-1' size={20}/>
            </button>

            {/* Menu Dropdown */}
            {isProfileOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-primary rounded-md shadow-xl z-10'>
                  {/* Lien vers le profil */}
                  <Link to='/profile' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                    <div className='flex items-center border-b-2 hover:bg-[#e4e0e7]'>
                      <img
                          src={user?.user.profileUrl ?? NoProfile}
                          alt="Photo de profil"
                          className='w-10 h-10 object-cover rounded-full'
                      />
                      <p className='ml-2'>{user?.user.firstName}</p>
                    </div>
                  </Link>

                  {/* Dropdown Notifications */}


                  {/* Lien vers Messages */}
                  <Link to='/messagerie'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                    <div className='flex items-center'>
                      <AiOutlineMessage size={20} className="text-[#7e22ce]"/>
                      <p className='ml-2'>Messages</p>
                    </div>
                  </Link>

                  {/* Lien vers Get Coins */}
                  <Link to='/getCoins'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                    <div className='flex items-center'>
                      <FaCoins size={20} className="text-[#7e22ce]"/>
                      <p className='ml-2'>Get Coins</p>
                    </div>
                  </Link>

                  {/* Lien vers Settings */}
                  <Link to='/settings'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                    <div className='flex items-center'>
                      <Settings size={20} className="text-[#7e22ce]"/>
                      <p className='ml-2'>Settings</p>
                    </div>
                  </Link>

                  {/* Lien pour se déconnecter */}
                  <Link to='/' className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                    <div className='flex items-center'>
                      <IoMdLogOut size={20} className="text-[#7e22ce]"/>
                      <p className='ml-2' onClick={() => dispatch(Logout())}>Déconnexion</p>
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
