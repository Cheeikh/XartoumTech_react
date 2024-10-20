import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/productSlice';

const AjouterArticle = () => {
  const dispatch = useDispatch();
  const [newProduct, setNewProduct] = useState({
    nom: '',
    categorie: '',
    prix: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProduct(newProduct));
    setNewProduct({ nom: '', categorie: '', prix: '', image: '' });
    alert('Produit ajouté avec succès !');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Ajouter un nouvel article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nom"
          value={newProduct.nom}
          onChange={handleInputChange}
          placeholder="Nom du produit"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="categorie"
          value={newProduct.categorie}
          onChange={handleInputChange}
          placeholder="Catégorie"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="prix"
          value={newProduct.prix}
          onChange={handleInputChange}
          placeholder="Prix"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="image"
          value={newProduct.image}
          onChange={handleInputChange}
          placeholder="URL de l'image"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded">
          Ajouter le produit
        </button>
      </form>
    </div>
  );
};

export default AjouterArticle;