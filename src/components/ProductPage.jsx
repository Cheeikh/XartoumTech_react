import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, Facebook, Twitter, Mail, Pinterest, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-4 py-8">
      {/* Left side - Product images */}
      <div className="w-full lg:w-2/3 pr-8">
        <img src={product.image} alt={product.nom} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        <div className="flex mt-4 space-x-2">
          {[1, 2, 3, 4].map((_, index) => (
            <img key={index} src={product.image} alt={`${product.nom} view ${index + 1}`} className="w-24 h-24 object-cover rounded-md shadow" />
          ))}
        </div>
      </div>

      {/* Right side - Product details */}
      <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
        <p className="text-sm text-gray-500 uppercase">{product.categorie}</p>
        <h1 className="text-3xl font-bold mt-2">{product.nom}</h1>
        <p className="text-2xl font-semibold mt-4">{product.prix} FCFA</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Taille</label>
            <Select>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choisir une option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Couleur</label>
            <Select>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choisir une option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noir">Noir</SelectItem>
                <SelectItem value="blanc">Blanc</SelectItem>
                <SelectItem value="rouge">Rouge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center mt-6">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border rounded-l">-</button>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-16 text-center border-t border-b" />
          <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border rounded-r">+</button>
          <Button className="ml-4 bg-purple-700 text-white px-6">AJOUTER AU PANIER</Button>
        </div>

        <p className="mt-6 text-sm text-purple-700 cursor-pointer flex items-center">
          <span className="mr-2">Guide des tailles</span>
          <ChevronDown size={16} />
        </p>

        <p className="mt-4 text-sm text-gray-600 flex items-center cursor-pointer">
          <Heart  size={16} className="mr-2" />
          Ajouter à la liste de souhaits
        </p>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">Description du produit</h3>
          <p className="text-sm text-gray-600">
            {product.description || "Description détaillée du produit non disponible pour le moment."}
          </p>
        </div>

        <div className="flex space-x-4 mt-8">
          <Facebook size={20} />
          <Twitter size={20} />
          <Mail size={20} />
          <Pinterest size={20} />
          <Linkedin size={20} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;