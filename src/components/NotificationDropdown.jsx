import React, { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { makeRequest } from "../axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const NotificationDropdown = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [page, setPage] = useState(1); // Pour la pagination

  // Initialiser le socket ici
  const socket = io("http://localhost:8800"); // Assurez-vous que l'URL correspond à votre serveur

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      markAllAsRead(); // Marque comme lu lorsque les notifications sont affichées
    }
  };

  const markAllAsRead = async () => {
    try {
      await makeRequest.put(`/notifications/mark-all-read`, null, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    } catch (error) {
      console.error("Erreur lors du marquage des notifications comme lues:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await makeRequest.get(`/notifications?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.success) {
        setNotifications((prev) => [...prev, ...response.data.data]); // Append new notifications
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  const loadMoreNotifications = async () => {
    setPage((prev) => prev + 1);
    await fetchNotifications();
  };

  const handleScroll = () => {
    // Charge plus de notifications si l'utilisateur atteint le bas de la liste
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMoreNotifications();
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, page]); // Ajout de page comme dépendance

  useEffect(() => {
    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new_notification", handleNewNotification);
    
    return () => {
      socket.off("new_notification", handleNewNotification); // Nettoyage
    };
  }, [socket]); // Ajoutez socket comme dépendance ici

  

  return (
    <div className='relative'>
      <IoMdNotificationsOutline
        className='cursor-pointer'
        onClick={handleShowNotifications}
      />
      {notifications.length > 0 && (
        <span className='absolute flex items-center justify-center w-5 h-5 text-xs bg-red-500 rounded-full -top-2 -right-2'>
          {notifications.length}
        </span>
      )}
      {showNotifications && (
        <div className='absolute right-0 z-50 mt-2 overflow-hidden rounded-lg shadow-lg top-full w-80 bg-primary'>
          <div className='p-4'>
            <h3 className='mb-2 text-lg font-semibold'>Notifications</h3>
            {notifications.length === 0 ? (
              <p>Aucune nouvelle notification</p>
            ) : (
              <ul>
              {notifications.map((notif) => (
                <li
                  key={`${notif._id}-${notif.createdAt}`} // Ajoutez un index pour garantir l'unicité
                  className='p-2 mb-2 rounded hover:bg-gray-100 '
                >
                  <p className='text-sm'>
                    {notif.type === "like" && `${notif.sender.firstName} a aimé votre publication`}
                    {notif.type === "comment" && `${notif.sender.firstName} a commenté votre publication`}
                    {notif.type === "new_comment" && `${notif.sender.firstName} a commenté votre publication`}
                    {notif.type === "friend_request" && `${notif.sender.firstName} vous a envoyé une demande d'ami`}
                    {notif.type === "friend_accept" && `${notif.sender.firstName} a accepté votre demande d'ami`}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            

            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
