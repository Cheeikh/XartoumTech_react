// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { makeRequest } from "../axios";
// import { useSelector } from "react-redux";
// import { BsPersonPlusFill, BsPersonDashFill } from "react-icons/bs";
// import { NoProfile } from "../assets";

// const FollowSuggestedUsers = () => {
//     const [suggestedUsers, setSuggestedUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [followStatus, setFollowStatus] = useState({});
//     const { user } = useSelector((state) => state.user);

//     // Fonction pour récupérer les utilisateurs suggérés
//     useEffect(() => {
//         const fetchSuggestedUsers = async () => {
//             try {
//                 const response = await makeRequest.post(`/users/suggested-friends`);
//                 setSuggestedUsers(response.data.data);
//                 checkFollowingStatus(response.data.data);
//             } catch (err) {
//                 console.error("Erreur lors de la récupération des utilisateurs suggérés:", err);
//                 setError('Erreur lors de la récupération des utilisateurs suggérés. Veuillez réessayer.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSuggestedUsers();
//     }, []);

//     // Fonction pour vérifier le statut de suivi des utilisateurs suggérés
//     const checkFollowingStatus = async (users) => {
//         try {
//             const response = await makeRequest.get(`/users/${user._id}/following`);
//             const following = response.data.following;
//             const status = users.reduce((acc, user) => {
//                 acc[user._id] = following.some(followed => followed._id === user._id);
//                 return acc;
//             }, {});
//             setFollowStatus(status);
//         } catch (err) {
//             console.error("Erreur lors de la vérification des suivis:", err);
//         }
//     };

//     // Fonction pour gérer le suivi/désabonnement
//     const handleFollowToggle = async (targetUserId, isFollowing) => {
//         try {
//             if (isFollowing) {
//                 await makeRequest.delete(`/users/${targetUserId}/unfollow`);
//             } else {
//                 await makeRequest.post(`/users/${targetUserId}/follow`);
//             }
//             setFollowStatus(prev => ({ ...prev, [targetUserId]: !isFollowing }));
//         } catch (err) {
//             console.error("Erreur lors du suivi/désabonnement:", err);
//         }
//     };

//     if (loading) return <p>Chargement...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;
//     if (suggestedUsers.length === 0) return <p>Aucun utilisateur suggéré pour le moment.</p>;

//     return (
//         <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
//             <h2 className="text-lg text-ascent-1 border-b border-[#9a00d7] mb-4">Suggestions à Suivre</h2>
//             {suggestedUsers.map((user) => (
//                 <div key={user._id} className="flex items-center justify-between mb-4">
//                     <Link to={`/profile/${user._id}`} className="flex gap-4 items-center">
//                         <img
//                             src={user?.profileUrl ?? NoProfile}
//                             alt={user?.firstName}
//                             className="w-10 h-10 object-cover rounded-full"
//                         />
//                         <div>
//                             <p className="text-base font-medium text-ascent-1">
//                                 {user?.firstName} {user?.lastName}
//                             </p>
//                             <span className="text-sm text-ascent-2">
//                                 {user?.profession ?? "Pas de Profession"}
//                             </span>
//                         </div>
//                     </Link>
//                     <button
//                         className="bg-[#0444a40a] text-sm text-[#9a00d7] p-1 rounded flex items-center"
//                         onClick={() => handleFollowToggle(user._id, followStatus[user._id])}
//                     >
//                         {followStatus[user._id] ? (
//                             <>
//                                 <BsPersonDashFill className="mr-1" />
//                                 Se désabonner
//                             </>
//                         ) : (
//                             <>
//                                 <BsPersonPlusFill className="mr-1" />
//                                 Suivre
//                             </>
//                         )}
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default FollowSuggestedUsers;