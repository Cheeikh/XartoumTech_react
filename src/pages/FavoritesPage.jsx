import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toggleFavorite, fetchProducts } from '../redux/productSlice';
import Layout from '../components/Layout';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { products, favorites, status } = useSelector(state => state.product);
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  const handleToggleFavorite = (productId) => {
    dispatch(toggleFavorite(productId));
  };

  console.log('Products:', products);
  console.log('Favorites:', favorites);
  console.log('Favorite Products:', favoriteProducts);

  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

  return (
    <Layout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>
        {favoriteProducts.length === 0 ? (
          <p>Vous n'avez pas encore de favoris.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map(product => (
              <div key={product.id} className="border rounded-lg p-4 relative">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.nom} className="w-full h-48 object-cover rounded-md" />
                  <h2 className="text-lg font-semibold mt-2">{product.nom}</h2>
                  <p className="text-gray-600">{product.prix} FCFA</p>
                </Link>
                <button
                  onClick={() => handleToggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                >
                  <Heart className="text-red-500 fill-current" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;