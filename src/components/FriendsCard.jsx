// FriendsCard.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { makeRequest } from "../axios";
import { useSelector, useDispatch } from "react-redux";
import { UpdateFriends } from "../redux/userSlice";

const FriendsCard = () => {
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.user);
  const fetchFriends = async () => {
    try {
      const response = await makeRequest.get("/users/friends");
      if (response.data.success) {
        dispatch(UpdateFriends(response.data.data));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des amis:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []); // Nous n'avons plus besoin de dépendre de 'user' ici

  return (
    <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
      <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#9a00d7]">
        <span>Amis</span>
        <span>{friends.length}</span>
      </div>

      <div className="w-full flex flex-col gap-4 pt-4">
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <Link
              to={"/profile/" + friend?._id}
              key={`${friend?._id}-${index}`}
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
