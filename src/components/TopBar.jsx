import React, { useState, useEffect } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { makeRequest } from "../axios";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {};

  const handleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const fetchNotifications = async () => {
    try {
      const response = await makeRequest.get(`/notifications`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
  }, [user]);

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
          <TbSocial />
        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
          XartoumTech
        </span>
      </Link>

      <form
        className='hidden md:flex items-center justify-center'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem]  rounded-l-full py-3 '
          register={register("search")}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'
        />
      </form>

      {/* ICONS */}
      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <Link to="/messagerie" className="relative">
          <IoChatbubbleEllipsesOutline className="cursor-pointer" />
        </Link>
        <div className='relative'>
          <IoMdNotificationsOutline
            className='cursor-pointer'
            onClick={handleShowNotifications}
          />
          {notifications.length > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500  rounded-full w-5 h-5 flex items-center justify-center text-xs'>
              {notifications.length}
            </span>
          )}
          {showNotifications && (
            <div className='absolute top-full right-0 mt-2 w-80 bg-primary shadow-lg rounded-lg overflow-hidden z-50'>
              <div className='p-4'>
                <h3 className='text-lg font-semibold mb-2'>Notifications</h3>
                {notifications.length === 0 ? (
                  <p>Aucune nouvelle notification</p>
                ) : (
                  <ul>
                    {notifications.map((notif) => (
                      <li key={notif._id} className='mb-2 p-2 hover:bg-gray-100 rounded '>
                        <p className='text-sm'>
                          {notif.type === 'like' && `${notif.sender.firstName} a aimé votre publication`}
                          {notif.type === 'comment' && `${notif.sender.firstName} a commenté votre publication`}
                          {notif.type === 'friend_request' && `${notif.sender.firstName} vous a envoyé une demande d'ami`}
                          {notif.type === 'friend_accept' && `${notif.sender.firstName} a accepté votre demande d'ami`}
                        </p>
                        <p className='text-xs text-gray-500'>{new Date(notif.createdAt).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title='Log Out'
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
