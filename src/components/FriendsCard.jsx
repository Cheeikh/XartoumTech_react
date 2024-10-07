// FriendsCard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";

const FriendsCard = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Récupérer les données de l'utilisateur à partir du localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const user = parsedData?.user; // Récupérer l'objet utilisateur
      setFriends(user?.friends || []); // Mettre à jour l'état avec la liste des amis
    }
  }, []);

  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
      <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Amis</span>
        <span>{friends.length}</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <Link
              to={"/profile/" + friend?._id}
              key={friend?._id}
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              <img
                src={friend?.profileUrl ?? NoProfile}
                alt={friend?.firstName}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {friend?.firstName} {friend?.lastName}
                </p>
                <span className="text-sm text-ascent-2">
                  {friend?.profession ?? "No Profession"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-ascent-2">Aucun ami à afficher</p>
        )}
      </div>
    </div>
  );
};

export default FriendsCard;
