import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { AiOutlineMessage } from "react-icons/ai";
import { FaCoins } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";

import { makeRequest } from "../axios";
import { NoProfile } from "../assets";
import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png";
import { ChevronDown, Settings } from 'lucide-react';

import NotificationDropdown from './NotificationDropdown';
import PaymentModeModal from "./PaymentModeModal";

const TopBar = ({ user, onSearch }) => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef(null);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    console.log("Envoi de la requête de recherche:", data.search);
    setSearchQuery(data.search);
    try {
      if (data.search.trim() === "") {
        const response = await makeRequest.get('/posts/get-posts');
        console.log("Réponse de la recherche (tous les posts):", response.data);
        if (response.data.success) {
          onSearch(response.data.data);
        }
      } else {
        const response = await makeRequest.get(`/posts/search?query=${data.search}`);
        console.log("Réponse de la recherche:", response.data);
        if (response.data.success) {
          onSearch(response.data.data);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='topbar w-full flex items-center justify-between py-3 px-4 bg-primary rounded-xl'>
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

      <div className='flex items-center gap-4 text-ascent-1 text-md md:text-xl'>
        <div>
          <button className='flex items-center focus:outline-none'>
            <NotificationDropdown/>
          </button>
        </div>
        <button
          onClick={handleTheme}
          className='flex items-center focus:outline-none'
        >
          {theme === "light" ? <BsMoon size={20}/> : <BsSunFill size={20}/>}
        </button>

        <h2 className='text-xl text-[#71717a]'>Hello,</h2>
        <h2 className='text-xl text-[#7e22ce] font-bold'>
          {user?.user.firstName} {user?.user.lastName}
        </h2>

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

          {isProfileOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-primary rounded-md shadow-xl z-10'>
              <Link to='/profile' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                <div className='flex items-center border-b-2 hover:bg-[#e4e0e7]'>
                  <img
                    src={user?.user.profileUrl ?? NoProfile}
                    alt="Photo de profil"
                    className='w-10 h-10 object-cover rounded-full'
                  />
                  <p className='ml-2'>{user?.user.firstName} {user?.user.lastName}</p>
                </div>
              </Link>

              <Link to='/messagerie' className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                <div className='flex items-center'>
                  <AiOutlineMessage size={20} className="text-[#7e22ce]"/>
                  <p className='ml-2'>Messages</p>
                </div>
              </Link>

                  {/* Lien vers Get Coins */}
                 

                  <div onClick={openModal} className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                  <button>
                    <div className='flex items-center'>
                      <FaCoins size={20} className="text-[#7e22ce]"/>
                      <p className='ml-2'>Get Coins</p>
                  </div> </button>
                    </div>
                    <PaymentModeModal 
                      isOpen={isModalOpen} 
                      onClose={closeModal}
                    />

                  {/* Lien vers Settings */}
                  <Link to='/settings'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                    <div className='flex items-center'>
                      <Settings size={20} className="text-[#7e22ce]"/>
                      <p className='ml-2'>Settings</p>
                    </div>
                  </Link>

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
      <PaymentModeModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default TopBar;
