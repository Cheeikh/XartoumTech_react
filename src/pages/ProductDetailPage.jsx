import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Pin, ShoppingCart, ChevronDown, Facebook, Twitter, Mail, Linkedin } from 'lucide-react';
import { toggleFavorite, togglePin, addToCart } from '../redux/productSlice';
import Layout from '../components/Layout';

const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showMeasurementsForm, setShowMeasurementsForm] = useState(false);
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    length: ''
  });
  const { products, favorites, pins, cart } = useSelector(state => state.product);
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (location.state && location.state.product) {
      setProduct(location.state.product);
      setLoading(false);
    } else if (products) {
      const foundProduct = products.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [location.state, products, id]);

  if (loading) {
    return <Layout user={user}><div className="text-center py-8">Chargement...</div></Layout>;
  }

  if (!product) {
    navigate('/');
    return null;
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product.id));
  };
  
  const handleTogglePin = () => {
    dispatch(togglePin(product.id));
  };
  
  const handleAddToCart = () => {
    const sizeData = selectedSize === 'custom' ? measurements : { size: selectedSize };
    dispatch(addToCart({ ...product, color: selectedColor, ...sizeData, quantity }));
  };

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);
    setShowMeasurementsForm(size === 'custom');
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setMeasurements(prev => ({ ...prev, [name]: numValue }));
    } else if (value === '') {
      setMeasurements(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isFavorite = favorites.includes(product.id);
  const isPinned = pins.includes(product.id);
  const isInCart = cart.some(item => item.id === product.id);

  return (
    <Layout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <img src={product.image} alt={product.nom} className="w-full h-auto object-cover rounded-lg shadow-lg" />
            <div className="flex mt-4 space-x-2">
              {[1, 2, 3, 4].map((_, index) => (
                <img key={index} src={product.image} alt={`${product.nom} view ${index + 1}`} className="w-24 h-24 object-cover rounded-md shadow" />
              ))}
            </div>
          </div>
          <div className="lg:w-1/3">
            <p className="text-sm text-gray-500 uppercase">{product.categorie}</p>
            <h1 className="text-3xl font-bold mt-2">{product.nom}</h1>
            <p className="text-2xl font-semibold mt-4">{product.prix} FCFA</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="size-select" className="block text-sm font-medium text-gray-700">Taille</label>
                <select 
                  id="size-select"
                  value={selectedSize} 
                  onChange={handleSizeChange}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="">Choisir une taille</option>
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                  <option value="custom">Mensurations personnalisées</option>
                </select>
              </div>

              {showMeasurementsForm && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Entrez vos mensurations (en cm)</h4>
                  {Object.entries(measurements).map(([key, value]) => (
                    <div key={key}>
                      <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                      <input
                        type="number"
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleMeasurementChange}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder={`Entrez votre ${key}`}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label htmlFor="color-select" className="block text-sm font-medium text-gray-700">Couleur</label>
                <select 
                  id="color-select"
                  value={selectedColor} 
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="">Choisir une couleur</option>
                  {['Noir', 'Blanc', 'Rouge', 'Bleu'].map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center mt-6">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border rounded-l">-</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} 
                className="w-16 text-center border-t border-b"
              />
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border rounded-r">+</button>
            </div>

            <div className="flex space-x-4 mt-6">
              <button 
                onClick={handleAddToCart} 
                className={`flex items-center ${
                  isInCart ? 'bg-green-600' : 'bg-purple-700'
                } text-white px-4 py-2 rounded transition duration-300 hover:bg-purple-800`}
              >
                <ShoppingCart className="mr-2" /> 
                {isInCart ? 'Dans le panier' : 'Ajouter au panier'}
              </button>
              <button 
                onClick={handleToggleFavorite} 
                className={`flex items-center border px-4 py-2 rounded transition duration-300 ${
                  isFavorite 
                    ? 'bg-purple-700 text-white border-purple-700' 
                    : 'border-purple-700 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Heart className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} /> 
                {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
              </button>
              <button 
                onClick={handleTogglePin} 
                className={`flex items-center border px-4 py-2 rounded transition duration-300 ${
                  isPinned 
                    ? 'bg-purple-700 text-white border-purple-700' 
                    : 'border-purple-700 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Pin className={`mr-2 ${isPinned ? 'fill-current' : ''}`} /> 
                {isPinned ? 'Épinglé' : 'Épingler'}
              </button>
            </div>

            <p className="mt-6 text-sm text-purple-700 cursor-pointer flex items-center">
              <span className="mr-2">Guide des tailles</span>
              <ChevronDown size={16} />
            </p>

            <div className="mt-8">
              <h3 className="font-semibold mb-2">Description du produit</h3>
              <p className="text-sm text-gray-600">
                {product.description || "Description détaillée du produit non disponible pour le moment."}
              </p>
            </div>

            <div className="flex space-x-4 mt-8">
              <Facebook size={20} className="text-gray-500 hover:text-blue-600 cursor-pointer" />
              <Twitter size={20} className="text-gray-500 hover:text-blue-400 cursor-pointer" />
              <Mail size={20} className="text-gray-500 hover:text-red-500 cursor-pointer" />
              <Linkedin size={20} className="text-gray-500 hover:text-blue-700 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;