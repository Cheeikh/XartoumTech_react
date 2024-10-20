import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown, Plus, X } from 'lucide-react';

// Composant CartIcon
const CartIcon = ({ itemCount }) => (
  <div className="relative">
    <ShoppingCart size={24} />
    {itemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {itemCount}
      </span>
    )}
  </div>
);

// Composant CatalogueHeader
const CatalogueHeader = ({ cartItemCount, totalAmount, onAddProduct, onOpenCart, onPay }) => {
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const paymentMethods = [
    { id: 'wave', name: 'Wave' },
    { id: 'orange', name: 'Orange Money' },
    { id: 'cash', name: 'Espèces à la livraison' }
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method.name);
    setIsPaymentMethodOpen(false);
  };

  return (
    <div className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catalogue des produits</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={onAddProduct}
            className="bg-blue-900 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={20} className="mr-2" /> Ajouter un nouveau produit
          </button>
          <button 
            onClick={onOpenCart}
            className="bg-blue-900 text-white px-4 py-2 rounded-md flex items-center"
          >
            <CartIcon itemCount={cartItemCount} />
            <span className="ml-2">Panier</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setIsPaymentMethodOpen(!isPaymentMethodOpen)}
              className="bg-white border border-gray-300 px-4 py-2 rounded-md flex items-center"
            >
              {selectedPaymentMethod || 'Mode de paiement'}
              <ChevronDown size={20} className="ml-2" />
            </button>
            {isPaymentMethodOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handlePaymentMethodSelect(method)}
                  >
                    {method.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={onPay}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
            disabled={!selectedPaymentMethod || cartItemCount === 0}
          >
            Payer ({totalAmount.toFixed(2)} €)
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant ProductList
const ProductList = ({ products, onAddToCart }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
    {products.map(product => (
      <div key={product.id} className="border rounded-lg p-4 shadow-md">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.price.toFixed(2)} €</p>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Ajouter au panier
        </button>
      </div>
    ))}
  </div>
);

// Composant Cart
const Cart = ({ cart, onRemoveFromCart, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span>{item.name} - {item.price.toFixed(2)} €</span>
              <button
                onClick={() => onRemoveFromCart(index)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onClose}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Fermer
      </button>
    </div>
  </div>
);

// Composant PaymentProcess
const PaymentProcess = ({ totalAmount, onClose, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'wave' || method === 'orange') {
      setShowQR(true);
    } else {
      setShowQR(false);
    }
  };

  const handlePaymentConfirmation = () => {
    // Simuler un paiement réussi
    setTimeout(() => {
      setPaymentComplete(true);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Paiement</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        {!paymentComplete ? (
          <>
            <p className="mb-4">Total à payer : {totalAmount.toFixed(2)} €</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Choisissez votre mode de paiement :</h3>
              <div className="space-y-2">
                {['wave', 'orange', 'cash'].map((method) => (
                  <button
                    key={method}
                    onClick={() => handlePaymentMethodSelect(method)}
                    className={`w-full p-2 border rounded ${paymentMethod === method ? 'bg-blue-500 text-white' : 'bg-white'}`}
                  >
                    {method === 'wave' ? 'Wave' : method === 'orange' ? 'Orange Money' : 'Espèces à la livraison'}
                  </button>
                ))}
              </div>
            </div>
            
            {showQR && (
              <div className="text-center mb-4">
                <img 
                  src={`/api/placeholder/200/200?text=${paymentMethod === 'wave' ? 'Wave QR' : 'Orange Money QR'}`}
                  alt="QR Code"
                  className="mx-auto mb-4"
                />
                <p>Scannez le code QR pour effectuer le paiement</p>
              </div>
            )}
            
            <button
              onClick={handlePaymentConfirmation}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              disabled={!paymentMethod}
            >
              Confirmer le paiement
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Paiement effectué avec succès !</p>
            <p className="text-lg font-semibold text-green-600 mb-8">Xartoum Tech vous remercie de votre fidélité</p>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant Principal CatalogueProduits
const CatalogueProduits = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    // Simuler le chargement des produits depuis une API
    const fetchProducts = async () => {
      const response = await new Promise(resolve =>
        setTimeout(() => resolve([
          { id: 1, name: "Produit 1", price: 19.99, image: "/api/placeholder/300/200" },
          { id: 2, name: "Produit 2", price: 29.99, image: "/api/placeholder/300/200" },
          { id: 3, name: "Produit 3", price: 39.99, image: "/api/placeholder/300/200" },
          // Ajoutez plus de produits ici
        ]), 1000)
      );
      setProducts(response);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleAddProduct = () => {
    // Logique pour ajouter un nouveau produit (à implémenter)
    console.log("Ajouter un nouveau produit");
  };

  const handlePay = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentComplete = () => {
    setCart([]);
    setIsPaymentOpen(false);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <CatalogueHeader 
        cartItemCount={cart.length}
        totalAmount={totalAmount}
        onAddProduct={handleAddProduct}
        onOpenCart={() => setIsCartOpen(true)}
        onPay={handlePay}
      />
      <div className="container mx-auto px-4">
        <ProductList products={products} onAddToCart={handleAddToCart} />
      </div>
      {isCartOpen && (
        <Cart 
          cart={cart} 
          onRemoveFromCart={handleRemoveFromCart} 
          onClose={() => setIsCartOpen(false)}
        />
      )}
      {isPaymentOpen && (
        <PaymentProcess 
          totalAmount={totalAmount}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default CatalogueProduits;