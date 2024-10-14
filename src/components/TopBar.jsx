import React from "react";
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
import NotificationDropdown from "./NotificationDropdown"; // Import du nouveau composant

import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png";
const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {};

  return (

    <div className='topbar w-full flex items-center justify-between py-3  px-4 bg-primary rounded-xl'>
      <Link to='/' className='flex gap-2 items-center'>
        <img src={LogoImage} alt="XartoumTech" className='h-10 md:h-16' />
      </Link>

      <form
        className='items-center justify-center hidden md:flex'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem]  rounded-full py-3 '
          register={register("search")}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#9a00d7] text-white px-6 py-2.5 mt-2 rounded-full ml-[-3rem]'
        />
      </form>

      {/* ICONS */}
      <div className='flex items-center gap-4 text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <Link to='/messagerie' className='relative'>
          <IoChatbubbleEllipsesOutline className='cursor-pointer' />
        </Link>
        
        {/* Notifications */}
        <NotificationDropdown />

        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title='Log Out'
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#9a00d7] rounded-full'
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
