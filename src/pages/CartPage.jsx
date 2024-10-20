import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { removeFromCart, updateCartItemQuantity } from '../redux/productSlice';
import Layout from '../components/Layout';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector(state => state.product);
  const user = useSelector(state => state.user);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Layout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <div>
            {cart.map(item => (
              <div key={item.id} className="flex items-center border-b py-4">
                <img src={item.image} alt={item.nom} className="w-24 h-24 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`} className="text-lg font-semibold">{item.nom}</Link>
                  <p className="text-gray-600">{item.prix} FCFA</p>
                  <div className="flex items-center mt-2">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-1">
                      <Minus size={16} />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-1">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button onClick={() => handleRemoveFromCart(item.id)} className="p-2 text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <div className="mt-8">
              <h2 className="text-2xl font-bold">Total: {calculateTotal()} FCFA</h2>
              <button 
                onClick={handleProceedToCheckout}
                className="mt-4 bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
              >
                Procéder au paiement
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;