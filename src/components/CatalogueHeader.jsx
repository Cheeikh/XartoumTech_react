// import React, { useState } from 'react';
// import { productCategories } from '../productData';

// const CatalogueHeader = ({ onAddProduct, onSelectCategory }) => {
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: '',
//     category: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onAddProduct(newProduct);
//     setNewProduct({ name: '', price: '', category: '' });
//     setShowAddForm(false);
//   };

//   return (
//     <div className="mb-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Catalogue</h1>
//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
//         >
//           {showAddForm ? 'Annuler' : 'Ajouter un produit'}
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-2 mb-4">
//         {productCategories.map(category => (
//           <button
//             key={category}
//             onClick={() => onSelectCategory(category)}
//             className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       {showAddForm && (
//         <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-md">
//           <div className="mb-2">
//             <input
//               type="text"
//               name="name"
//               value={newProduct.name}
//               onChange={handleInputChange}
//               placeholder="Nom du produit"
//               className="w-full p-2 rounded-md"
//               required
//             />
//           </div>
//           <div className="mb-2">
//             <input
//               type="number"
//               name="price"
//               value={newProduct.price}
//               onChange={handleInputChange}
//               placeholder="Prix"
//               className="w-full p-2 rounded-md"
//               required
//             />
//           </div>
//           <div className="mb-2">
//             <select
//               name="category"
//               value={newProduct.category}
//               onChange={handleInputChange}
//               className="w-full p-2 rounded-md"
//               required
//             >
//               <option value="">Sélectionnez une catégorie</option>
//               {productCategories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>
//           <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
//             Ajouter
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CatalogueHeader;