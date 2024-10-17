import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';

const produitsDisponibles = [
  { 
    id: 1, 
    nom: 'T-shirt', 
    prix: 19.99, 
    couleurs: ['Rouge', 'Bleu', 'Vert'], 
    tailles: ['S', 'M', 'L', 'XL'],
    image: './logo192.png'
  },
  { 
    id: 2, 
    nom: 'Pantalon', 
    prix: 39.99, 
    couleurs: ['Noir', 'Beige'], 
    tailles: ['38', '40', '42', '44'],
    image: './logo192.png'
  },
  // Ajoutez 4 produits supplémentaires pour remplir la grille
  { id: 3, nom: 'Chaussures', prix: 59.99, couleurs: ['Blanc', 'Noir'], tailles: ['39', '40', '41', '42'], image: './logo192.png' },
  { id: 4, nom: 'Veste', prix: 79.99, couleurs: ['Bleu', 'Gris'], tailles: ['S', 'M', 'L'], image: './logo192.png' },
  { id: 5, nom: 'Chapeau', prix: 24.99, couleurs: ['Noir', 'Marron'], tailles: ['Unique'], image: './logo192.png' },
  { id: 6, nom: 'Écharpe', prix: 14.99, couleurs: ['Rouge', 'Vert'], tailles: ['Unique'], image: './logo192.png' },
];

const PageAchat = () => {
  const [panier, setPanier] = useState([]);
  const [modePaiement, setModePaiement] = useState('');
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [afficherQR, setAfficherQR] = useState(false);
  const [paiementEffectue, setPaiementEffectue] = useState(false);
  const [produitOuvert, setProduitOuvert] = useState(null);
  const [couleurSelectionnee, setCouleurSelectionnee] = useState('');
  const [tailleSelectionnee, setTailleSelectionnee] = useState('');

  const ouvrirProduit = (produit) => {
    setProduitOuvert(produit);
    setCouleurSelectionnee('');
    setTailleSelectionnee('');
  };

  const ajouterAuPanier = () => {
    if (couleurSelectionnee && tailleSelectionnee) {
      setPanier([...panier, { ...produitOuvert, couleur: couleurSelectionnee, taille: tailleSelectionnee, quantite: 1 }]);
      setProduitOuvert(null);
    } else {
      alert("Veuillez sélectionner une couleur et une taille.");
    }
  };

  const retirerDuPanier = (index) => {
    const nouveauPanier = [...panier];
    nouveauPanier.splice(index, 1);
    setPanier(nouveauPanier);
  };

  const totalPanier = panier.reduce((total, item) => total + item.prix * item.quantite, 0);

  const handlePaiement = () => {
    if (modePaiement === 'wave' || modePaiement === 'orange') {
      setAfficherQR(true);
    } else {
      setTimeout(() => {
        setPaiementEffectue(true);
        setPanier([]);
      }, 2000);
    }
  };

  const confirmerPaiementQR = () => {
    setAfficherQR(false);
    setPaiementEffectue(true);
    setPanier([]);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-800">Catalogue des produits</h1>
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center px-4 py-2 bg-blue text-white rounded-md hover:bg-blue transition duration-300"
            onClick={() => setPanierOuvert(!panierOuvert)}
          >
            <ShoppingCart className="mr-2" />
            Panier ({panier.length})
          </button>
          <select 
            className="px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setModePaiement(e.target.value)}
            value={modePaiement}
          >
            <option value="">Mode de paiement</option>
            <option value="wave">Wave</option>
            <option value="orange">Orange Money</option>
            <option value="especes">Espèces à la livraison</option>
          </select>
          <button 
            className="px-4 py-2 bg-green text-white rounded-md hover:bg-green transition duration-300 disabled:bg-gray disabled:cursor-not-allowed"
            onClick={handlePaiement}
            disabled={panier.length === 0 || !modePaiement}
          >
            Payer ({totalPanier.toFixed(2)} €)
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {produitsDisponibles.map((produit) => (
          <div 
            key={produit.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
            onClick={() => ouvrirProduit(produit)}
          >
            <img 
              src={produit.image} 
              alt={produit.nom} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">{produit.nom}</h3>
              <p className="font-bold text-blue-600">{produit.prix} €</p>
            </div>
          </div>
        ))}
      </div>

      {panierOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
          <div className="bg-white w-96 h-full shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Panier</h2>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setPanierOuvert(false)}>
                <X size={24} />
              </button>
            </div>
            {panier.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4 pb-4 border-b">
                <div>
                  <h3 className="font-semibold">{item.nom}</h3>
                  <p className="text-sm text-gray-600">{item.couleur}, {item.taille}</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 font-bold">{item.prix} €</span>
                  <button 
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                    onClick={() => retirerDuPanier(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <strong className="text-xl">Total: {totalPanier.toFixed(2)} €</strong>
            </div>
          </div>
        </div>
      )}

      {produitOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{produitOuvert.nom}</h2>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setProduitOuvert(null)}>
                <X size={24} />
              </button>
            </div>
            <img 
              src={produitOuvert.image} 
              alt={produitOuvert.nom} 
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <select 
              className="w-full p-2 mb-4 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCouleurSelectionnee(e.target.value)}
              value={couleurSelectionnee}
            >
              <option value="">Choisir une couleur</option>
              {produitOuvert.couleurs.map((couleur) => (
                <option key={couleur} value={couleur}>{couleur}</option>
              ))}
            </select>
            <select 
              className="w-full p-2 mb-4 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setTailleSelectionnee(e.target.value)}
              value={tailleSelectionnee}
            >
              <option value="">Choisir une taille</option>
              {produitOuvert.tailles.map((taille) => (
                <option key={taille} value={taille}>{taille}</option>
              ))}
            </select>
            <button 
              onClick={ajouterAuPanier} 
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      )}

      {afficherQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Scannez le code QR pour payer</h2>
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 w-64 h-64 flex items-center justify-center text-gray-500">
                {modePaiement === 'wave' ? 'Code QR Wave' : 'Code QR Orange Money'}
              </div>
            </div>
            <button 
              onClick={confirmerPaiementQR}
              className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Confirmer le paiement
            </button>
          </div>
        </div>
      )}

      {paiementEffectue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Paiement effectué avec succès</h2>
            <p className="mb-4 text-gray-700">Votre commande a été validée et sera bientôt expédiée.</p>
            <p className="text-sm text-gray-500 mb-6">Xartoum-tech vous remercie de votre fidélité!</p>
            <button 
              onClick={() => setPaiementEffectue(false)}
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageAchat;