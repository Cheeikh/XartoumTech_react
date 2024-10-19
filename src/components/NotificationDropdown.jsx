import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NoProfile } from "../assets";
import { makeRequest } from "../axios";
import { useSelector } from "react-redux";

const NotificationDropdown = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Supprimer la référence à socket.io
  // const socket = useRef(io("http://localhost:8800"));

  // Fonction pour récupérer les nouvelles notifications
  const fetchNewNotifications = useCallback(async () => {
    try {
      const response = await makeRequest.get(`/notifications?page=1`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.success) {
        const newNotifications = response.data.data;
        setNotifications((prev) => {
          const updatedNotifications = [...newNotifications, ...prev];
          return updatedNotifications.filter((notif, index, self) =>
            index === self.findIndex((t) => t._id === notif._id)
          );
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des nouvelles notifications:", error);
    }
  }, [user]);

  // Utiliser un intervalle pour récupérer les nouvelles notifications
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user?.token) {
        fetchNewNotifications();
      }
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(intervalId);
  }, [user, fetchNewNotifications]);

  // Toggle affichage notifications
  const handleShowNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      markAllAsRead();
    }
  }, [showNotifications]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      await makeRequest.put(`/notifications/mark-all-read`, null, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error(
        "Erreur lors du marquage des notifications comme lues:",
        error
      );
    }
  }, [user]);

  // Récupérer les notifications avec pagination
  const fetchNotifications = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setError(null); // Réinitialiser l'erreur avant une nouvelle requête
    try {
      const response = await makeRequest.get(`/notifications?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.success) {
        const newNotifications = response.data.data;
        setNotifications((prev) => [...prev, ...newNotifications]);
        setHasMore(newNotifications.length > 0);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      setError("Erreur lors de la récupération des notifications.");
    } finally {
      setIsLoading(false);
    }
  }, [user, page, hasMore, isLoading]);

  // Gestion du scroll pour charger plus de notifications
  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      if (scrollHeight - scrollTop === clientHeight) {
        fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  // Charger les notifications au montage du composant
  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Générer le contenu de la notification
  const getNotificationContent = (notif) => {
    const notifTypes = {
      like: `${notif.sender?.firstName} a aimé votre publication`,
      post: `${notif.sender?.firstName} a publié une nouvelle publication`,
      new_post: `${notif.sender?.firstName} a publié un nouveau post`,
      friend_request: `${notif.sender?.firstName} vous a envoyé une demande d'ami`,
      friend_accept: `${notif.sender?.firstName} a accepté votre demande d'ami`,
      group_invite: `${notif.sender?.firstName} vous a invité à rejoindre un groupe`,
      event_invite: `${notif.sender?.firstName} vous a invité à un événement`,
      new_comment: `${notif.sender?.firstName} a commenté votre publication`,
    };

    let content = notifTypes[notif.type] || "Nouvelle notification";

    if (notif.metadata) {
      if (notif.metadata.groupName) {
        content += ` : ${notif.metadata.groupName}`;
      }
      if (notif.metadata.eventName) {
        content += ` : ${notif.metadata.eventName}`;
      }
    }

    return content;
  };

  // Filtrer les notifications dupliquées avant le rendu
  const uniqueNotifications = notifications.reduce((acc, notif) => {
    if (!acc.some((item) => item._id === notif._id)) {
      acc.push(notif);
    }
    return acc;
  }, []);

  // Gérer le clic en dehors du dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gérer le clic sur une notification
  const handleNotificationClick = async (notif) => {
    console.log("Notification clicked:", notif);
    // Marquer la notification comme lue lors du clic
    await markNotificationAsRead(notif._id);
    // Vous pouvez gérer la navigation ici si nécessaire
  };

  // Marquer une notification spécifique comme lue
  const markNotificationAsRead = async (id) => {
    try {
      await makeRequest.put(`/notifications/${id}/mark-read`, null, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error(
        "Erreur lors du marquage de la notification comme lue:",
        error
      );
    }
  };

  // Rendre une notification avec clé unique
  const renderNotification = (notif) => {
    return (
      <li
        key={notif._id}
        className={`p-2 mb-2 rounded hover:bg-gray-100 flex items-center space-x-2 ${
          !notif.read ? "bg-blue-100" : ""
        }`}
        onClick={() => handleNotificationClick(notif)} // Ajout du gestionnaire de clic
      >
        <img
          src={notif.sender?.profileUrl ?? NoProfile}
          alt="User Image"
          className="object-cover w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-sm">{getNotificationContent(notif)}</p>
          <p className="text-xs text-gray-500">
            {new Date(notif.createdAt).toLocaleString()}
          </p>
        </div>
      </li>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <IoMdNotificationsOutline
        className="cursor-pointer"
        onClick={handleShowNotifications}
      />
      {notifications.filter((n) => !n.read).length > 0 && (
        <span
          className="absolute flex items-center justify-center w-5 h-5 text-xs bg-red-800 rounded-full -top-2 -right-2"
          style={{ backgroundColor: "#f56565", color: "#fff" }}
        >
          {notifications.filter((n) => !n.read).length > 9
            ? "9+"
            : notifications.filter((n) => !n.read).length}
        </span>
      )}
      {showNotifications && (
        <div className="absolute right-0 z-50 mt-2 overflow-hidden rounded-lg shadow-lg top-full w-80 bg-primary">
          <div className="p-4">
            <h3 className="mb-2 text-lg font-semibold">Notifications</h3>
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Affichage des erreurs */}
            {uniqueNotifications.length === 0 ? (
              <p>Aucune nouvelle notification</p>
            ) : (
              <ul className="overflow-y-auto max-h-60" onScroll={handleScroll}>
                {uniqueNotifications.map(renderNotification)}
              </ul>
            )}
            {isLoading && <p className="text-center">Chargement...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
