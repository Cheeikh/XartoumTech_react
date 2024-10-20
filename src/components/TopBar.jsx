import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill, BsHandbag } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { FaCoins } from "react-icons/fa6";
import { ChevronDown, Settings, Search, Heart, Pin, ShoppingBag, Shirt } from 'lucide-react';
import { SetTheme } from "../redux/theme";
import { Logout, canAddProducts } from "../redux/userSlice";
import TextInput from "./TextInput";
import NotificationDropdown from './NotificationDropdown';
import { NoProfile } from "../assets";
import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png";

const TopBar = ({ user }) => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit } = useForm();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isClothingMenuOpen, setIsClothingMenuOpen] = useState(false);
  const [isShoppingMenuOpen, setIsShoppingMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const clothingMenuRef = useRef(null);
  const shoppingMenuRef = useRef(null);
  const { favorites, pins, cart } = useSelector(state => state.product);
  const cartItemCount = cart.length;
  const userCanAddProducts = useSelector(canAddProducts);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    console.log("Searching for:", data.search);
    // Implement your search logic here
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleClothingMenu = () => {
    setIsClothingMenuOpen(!isClothingMenuOpen);
  };

  const toggleShoppingMenu = () => {
    setIsShoppingMenuOpen(!isShoppingMenuOpen);
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate(-1);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsClothingMenuOpen(false);
    setIsShoppingMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (clothingMenuRef.current && !clothingMenuRef.current.contains(event.target)) {
        setIsClothingMenuOpen(false);
      }
      if (shoppingMenuRef.current && !shoppingMenuRef.current.contains(event.target)) {
        setIsShoppingMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='topbar w-full flex items-center justify-between py-3 px-4 bg-primary rounded-xl'>
      <Link to='/' onClick={handleLogoClick} className='flex gap-2 items-center'>
        <img src={LogoImage} alt="XartoumTech" className='h-10 md:h-16' />
      </Link>

      <form
        className='items-center justify-center hidden md:flex'
        onSubmit={handleSubmit(handleSearch)}
      >
        <div className="relative">
          <TextInput
            placeholder='Search...'
            styles='w-[18rem] lg:w-[38rem] rounded-full py-3 pl-10'
            register={register("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </form>

      <div className='flex items-center gap-4 text-ascent-1 text-md md:text-xl'>
        <div className='relative' ref={shoppingMenuRef}>
          <button
            onClick={toggleShoppingMenu}
            className='flex items-center focus:outline-none'
          >
            <div className="relative">
              <BsHandbag size={20} className="text-[#7e22ce]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </div>
          </button>

          {isShoppingMenuOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-primary rounded-md shadow-xl z-10'>
              <button onClick={() => handleNavigate('/vente-achat')} className='w-full block px-4 py-2 text-sm text-left text-gray-700 hover:bg-[#e4e0e7]'>
                Voir les articles
              </button>
              {userCanAddProducts && (
                <button onClick={() => handleNavigate('/ajouter-article')} className='w-full block px-4 py-2 text-sm text-left text-gray-700 hover:bg-[#e4e0e7]'>
                  Ajouter un article
                </button>
              )}
            </div>
          )}
        </div>

        <div className='relative' ref={clothingMenuRef}>
          <button
            onClick={toggleClothingMenu}
            className='flex items-center focus:outline-none'
          >
            <Shirt size={24} className="text-[#7e22ce]" />
          </button>

          {isClothingMenuOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-primary rounded-md shadow-xl z-10'>
              <button onClick={() => handleNavigate('/favorites')} className='w-full block px-4 py-2 text-sm text-left text-gray-700 hover:bg-[#e4e0e7]'>
                <div className='flex items-center'>
                  <Heart size={20} className={`${favorites.length > 0 ? 'text-red-500 fill-current' : 'text-[#7e22ce]'}`} />
                  <p className='ml-2'>Favoris ({favorites.length})</p>
                </div>
              </button>
              <button onClick={() => handleNavigate('/pinned')} className='w-full block px-4 py-2 text-sm text-left text-gray-700 hover:bg-[#e4e0e7]'>
                <div className='flex items-center'>
                  <Pin size={20} className={`${pins.length > 0 ? 'text-blue-500 fill-current' : 'text-[#7e22ce]'}`} />
                  <p className='ml-2'>Épinglés ({pins.length})</p>
                </div>
              </button>
              <button onClick={() => handleNavigate('/cart')} className='w-full block px-4 py-2 text-sm text-left text-gray-700 hover:bg-[#e4e0e7]'>
                <div className='flex items-center'>
                  <ShoppingBag size={20} className="text-[#7e22ce]" />
                  <p className='ml-2'>Panier</p>
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>

        <div>
          <button className='flex items-center focus:outline-none'>
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

        <h2 className='text-xl text-[#71717a] '>Hello,</h2>
        <h2 className='text-xl text-[#7e22ce] font-bold'>
          {user?.user.firstName}
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
                  <p className='ml-2'>{user?.user.firstName}</p>
                </div>
              </Link>

              <Link to='/messagerie'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                <div className='flex items-center'>
                  <AiOutlineMessage size={20} className="text-[#7e22ce]"/>
                  <p className='ml-2'>Messages</p>
                </div>
              </Link>

              <Link to='/getCoins'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-[#e4e0e7] focus:opacity-40'>
                <div className='flex items-center'>
                  <FaCoins size={20} className="text-[#7e22ce]"/>
                  <p className='ml-2'>Get Coins</p>
                </div>
              </Link>

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
    </div>
  );
};

export default TopBar;