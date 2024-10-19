import React, { useState } from 'react';
import { Heart, Pin, ShoppingCart } from 'lucide-react';
import PaymentProcess from './PaymentProcess';

const ProductDetail = ({ product, onGoBack, onAddToCart, onToggleFavorite, onTogglePin }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showPaymentProcess, setShowPaymentProcess] = useState(false);

  if (!product) return null;

  const handleBuyNow = () => {
    onAddToCart({ ...product, color: selectedColor, size: selectedSize });
    setShowPaymentProcess(true);
  };

  const handlePaymentComplete = () => {
    console.log('Paiement effectué avec succès');
    // Ajoutez ici toute logique supplémentaire après le paiement
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={onGoBack} className="mb-4 bg-purple-600 text-white px-4 py-2 rounded-md">
        Retour à la liste des produits
      </button>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-purple-600 font-semibold mb-4">{product.price} FCFA</p>
          <p className="mb-4">{product.description}</p>
          
          {/* Ajoutez ici les sélecteurs de couleur et de taille si nécessaire */}
          
          <div className="flex space-x-4 mt-6">
            <button 
              onClick={handleBuyNow}
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              <ShoppingCart className="mr-2" /> Acheter maintenant
            </button>
            <button 
              onClick={() => onToggleFavorite(product.id)}
              className="flex items-center border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-100"
            >
              <Heart className="mr-2" /> Favoris
            </button>
            <button 
              onClick={() => onTogglePin(product.id)}
              className="flex items-center border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-100"
            >
              <Pin className="mr-2" /> Épingler
            </button>
          </div>
          
          {showPaymentProcess && (
            <PaymentProcess 
              totalAmount={product.price} 
              onPaymentComplete={handlePaymentComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;