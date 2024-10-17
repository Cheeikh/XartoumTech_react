// Sidebar.jsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const ButtonAchat = () => {
  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    padding: '10px',
    cursor: 'pointer',
    color: '#6b6b6b',
    transition: 'background-color 0.3s',
  };

  const itemHoverStyle = {
    backgroundColor: '#e0e0e0',
    borderRadius: '8px',
  };

  return (
    <div style={sidebarStyle}>
      <div
        style={itemStyle}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <FontAwesomeIcon icon={faShoppingBag} />
        <span>Shop</span>
      </div>
      {/* Ajoutez d'autres éléments ici */}
    </div>
  );
};

export default ButtonAchat;
