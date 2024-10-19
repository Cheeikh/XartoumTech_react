// import React, { useState } from 'react';
// import { Search } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     }
//   };

//   return (
//     <form onSubmit={handleSearch} className="flex items-center">
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="Rechercher un article..."
//         className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
//       >
//         <Search size={20} />
//       </button>
//     </form>
//   );
// };

// export default SearchBar;