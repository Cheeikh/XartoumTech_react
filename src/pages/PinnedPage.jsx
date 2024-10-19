import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Pin } from 'lucide-react';
import { togglePin } from '../redux/productSlice';
import Layout from '../components/Layout';

const PinnedPage = () => {
  const dispatch = useDispatch();
  const { products, pins } = useSelector(state => state.product);
  const user = useSelector(state => state.user);

  const pinnedProducts = products.filter(product => pins.includes(product.id));

  const handleTogglePin = (productId) => {
    dispatch(togglePin(productId));
  };

  console.log('Pins:', pins);
  console.log('Pinned Products:', pinnedProducts);

  return (
    <Layout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Articles Épinglés</h1>
        {pinnedProducts.length === 0 ? (
          <p>Vous n'avez pas encore épinglé d'articles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedProducts.map(product => (
              <div key={product.id} className="border rounded-lg p-4 relative">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.nom} className="w-full h-48 object-cover rounded-md" />
                  <h2 className="text-lg font-semibold mt-2">{product.nom}</h2>
                  <p className="text-gray-600">{product.prix} FCFA</p>
                </Link>
                <button
                  onClick={() => handleTogglePin(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                >
                  <Pin className="text-blue-500 fill-current" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PinnedPage;