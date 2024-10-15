// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FollowButton = ({ userId, targetUserId }) => {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const checkFollowingStatus = async () => {
//       try {
//         // Vérifiez si l'utilisateur authentifié suit déjà le targetUser
//         const response = await axios.get(`/users/${targetUserId}/followers`);
//         const followers = response.data.followers;
//         setIsFollowing(followers.some(follower => follower._id === userId));
//       } catch (err) {
//         console.error("Erreur lors de la vérification du suivi :", err);
//       }
//     };

//     checkFollowingStatus();
//   }, [userId, targetUserId]);

//   const handleFollowToggle = async () => {
//     setLoading(true);
//     setError('');

    // try {
    //   if (isFollowing) {
    //     // Si l'utilisateur suit déjà, désabonnez-le
    //     await axios.delete(`/api/users/${targetUserId}/unfollow`, {
    //       headers: {
    //         Authorization: `Bearer ${yourJWTToken}`, // Remplacez par votre JWT
    //       },
    //     });
    //     setIsFollowing(false);
    //   } else {
    //     // Sinon, suivez l'utilisateur
    //     await axios.post(`/api/users/${targetUserId}/follow`, {}, {
    //       headers: {
    //         Authorization: `Bearer ${yourJWTToken}`, // Remplacez par votre JWT
    //       },
    //     });
    //     setIsFollowing(true);
    //   }
    // } catch (err) {
    //   setError("Erreur lors du suivi/désabonnement.");
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
//   };

//   return (
//     <div>
//       <button onClick={handleFollowToggle} disabled={loading}>
//         {loading ? 'Chargement...' : (isFollowing ? 'Se désabonner' : 'Suivre')}
//       </button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default FollowButton;
