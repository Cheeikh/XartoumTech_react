import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';

const produitsDisponibles = [
  { 
    id: 1, 
    nom: 'T-shirt', 
    prix: 19.99, 
    couleurs: ['Rouge', 'Bleu', 'Vert'], 
    tailles: ['S', 'M', 'L', 'XL'],
    image: '/api/placeholder/300/200'
  },
  { 
    id: 2, 
    nom: 'Pantalon', 
    prix: 39.99, 
    couleurs: ['Noir', 'Beige'], 
    tailles: ['38', '40', '42', '44'],
    image: '/api/placeholder/300/200'
  },
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
    <div className="container mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catalogue des produits</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setPanierOuvert(!panierOuvert)}>
            <ShoppingCart className="mr-2" />
            Panier ({panier.length})
          </button>
          <select 
            className="px-4 py-2 border rounded"
            onChange={(e) => setModePaiement(e.target.value)}
            value={modePaiement}
          >
            <option value="">Mode de paiement</option>
            <option value="wave">Wave</option>
            <option value="orange">Orange Money</option>
            <option value="especes">Espèces à la livraison</option>
          </select>
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
            onClick={handlePaiement}
            disabled={panier.length === 0 || !modePaiement}
          >
            Payer ({totalPanier.toFixed(2)} €)
          </button>
        </div>
      </div>
      
      {panierOuvert && (
        <div className="absolute right-0 top-16 w-80 z-10 bg-white border rounded shadow-lg">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold">Panier</h2>
            <button className="text-gray-500" onClick={() => setPanierOuvert(false)}><X /></button>
          </div>
          <div className="p-4">
            {panier.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>{item.nom} - {item.couleur}, {item.taille}</span>
                <div>
                  <span className="mr-2">{item.prix} €</span>
                  <button className="px-2 py-1 bg-red-500 text-white rounded text-sm" onClick={() => retirerDuPanier(index)}>X</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <strong>Total: {totalPanier.toFixed(2)} €</strong>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produitsDisponibles.map((produit) => (
          <div key={produit.id} className="border rounded cursor-pointer" onClick={() => ouvrirProduit(produit)}>
            <img 
              src={produit.image} 
              alt={produit.nom} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold">{produit.nom}</h3>
              <p className="font-bold mt-2">{produit.prix} €</p>
            </div>
          </div>
        ))}
      </div>

      {produitOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{produitOuvert.nom}</h2>
            <img 
              src={produitOuvert.image} 
              alt={produitOuvert.nom} 
              className="w-full h-48 object-cover mb-4"
            />
            <select 
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setCouleurSelectionnee(e.target.value)}
              value={couleurSelectionnee}
            >
              <option value="">Choisir une couleur</option>
              {produitOuvert.couleurs.map((couleur) => (
                <option key={couleur} value={couleur}>{couleur}</option>
              ))}
            </select>
            <select 
              className="w-full p-2 mb-4 border rounded"
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
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Ajouter au panier
            </button>
            <button 
              onClick={() => setProduitOuvert(null)} 
              className="w-full p-2 mt-2 bg-gray-300 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {afficherQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Scannez le code QR pour payer</h2>
            <div className="flex justify-center">
              <div className="bg-gray-200 w-48 h-48 flex items-center justify-center">
                {modePaiement === 'wave' ? 'Code QR Wave' : 'Code QR Orange Money'}
              </div>
            </div>
            <button 
              onClick={confirmerPaiementQR}
              className="w-full p-2 mt-4 bg-green-500 text-white rounded"
            >
              Confirmer le paiement
            </button>
          </div>
        </div>
      )}

      {paiementEffectue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Paiement effectué avec succès</h2>
            <p>Votre commande a été validée et sera bientôt expédiée.</p>
            <p className="mt-4 text-sm text-gray-500">Xartoum-tech vous remercie de votre fidélité!</p>
            <button 
              onClick={() => setPaiementEffectue(false)}
              className="w-full p-2 mt-4 bg-blue-500 text-white rounded"
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