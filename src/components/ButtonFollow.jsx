import React, { useState } from 'react';

const FollowButton = ({ isFollowingInitial }) => {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <button onClick={handleClick}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
