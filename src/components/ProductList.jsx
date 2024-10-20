// import React from 'react';

// const ProductList = ({ products, onSelectProduct, onAddToCart }) => (
//   <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//     {products.map((product) => (
//       <div 
//         key={product.id} 
//         className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
//         onClick={() => onSelectProduct(product.id)}
//       >
//         <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
//         <div className="p-4">
//           <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
//           <p className="text-purple-600 font-bold">{product.price} FCFA</p>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onAddToCart(product);
//             }}
//             className="mt-2 bg-purple-600 text-white px-2 py-1 rounded-md hover:bg-purple-700"
//           >
//             Ajouter au panier
//           </button>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// export default ProductList;