import React from 'react';

const Cart = ({ cartItems, onRemoveFromCart }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">Panier</h2>
    {cartItems.length === 0 ? (
      <p>Votre panier est vide.</p>
    ) : (
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name} - {item.price} FCFA</span>
            <button
              onClick={() => onRemoveFromCart(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Cart;