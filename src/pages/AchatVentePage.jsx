import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';

// Assurez-vous que le composant est correctement exporté
export default function AchatVentePage() {
  const [produitsVedettes, setProduitsVedettes] = useState([]);
  const [meilleuresVentes, setMeilleuresVentes] = useState([]);
  const [nouveautes, setNouveautes] = useState([]);
  const [tousLesProduits, setTousLesProduits] = useState([]);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState(null);
  const [diapositiveCourante, setDiapositiveCourante] = useState(0);

  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const categories = [
    "TISSUS", "MERCERIE", "MACHINES", "OUTILS", "PATRONS", "ÉQUIPEMENT", "FORMATIONS", "VENTE FLASH"
  ];

  useEffect(() => {
    // Simuler la récupération des données depuis une API
    const fetchData = () => {
      const produits = [
        { id: 1, nom: "Nouvelle collection de tissus", categorie: "TISSUS", prix: 10000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcFW-zBUP6vEOP-s2tG4wsob7rhu80fXN_vA&s" },
        { id: 2, nom: "Machines à coudre professionnelles", categorie: "MACHINES", prix: 150000, image: "https://i.pinimg.com/200x150/6b/7d/d3/6b7dd3a1a5d96578564f26eaf51abfc9.jpg" },
        { id: 3, nom: "Accessoires de couture tendance", categorie: "MERCERIE", prix: 5000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHT6I4IBk5tcBipAP1nDdMRBFyFq86llH9pw&s" },
        { id: 4, nom: "Tissu wax premium", categorie: "TISSUS", prix: 5000, image: "https://www.youreleganceshop.com/wp-content/uploads/2022/10/robe-moulante-noir-dakar.jpg" },
        { id: 5, nom: "Kit de couture complet", categorie: "ACCESSOIRES", prix: 15000, image: "https://i.pinimg.com/736x/62/e4/ff/62e4ffd273d2824b526fadb81521049b.jpg" },
        { id: 6, nom: "Machine à coudre portable", categorie: "MACHINES", prix: 75000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBWCfPLtsdq4Bb23NBIOyXqKdGTEDFlgyrQ9LNOl3lrdOHAHgj85d4xkggK_U2ZTN15AA&usqp=CAU" },
        { id: 7, nom: "Ciseaux de précision", categorie: "OUTILS", prix: 8000, image: "https://i.ebayimg.com/images/g/zA0AAOSwpLle7ytz/s-l640.jpg" },
        { id: 8, nom: "Mannequin ajustable", categorie: "ÉQUIPEMENT", prix: 50000, image: "https://i.ytimg.com/vi/VHrD7_mWVKw/maxresdefault.jpg" },
        { id: 9, nom: "Tissu soie naturelle", categorie:  "TISSUS", prix: 12000, image: "https://sunushopping.com/wp-content/uploads/2021/09/TWO-M-tourkie-ndiareme.png" },
        { id: 10, nom: "Lot de boutons vintage", categorie: "MERCERIE", prix: 3000, image: "https://www.cdiscount.com/pdt2/7/8/5/1/300x300/mp58450785/rw/1-5-ans-bebe-enfant-fille-vetements-d-ete-robe-dos.jpg" },
        { id: 11, nom: "Fil à broder multicolore", categorie: "MERCERIE", prix: 1500, image: "https://i.pinimg.com/736x/0a/ae/55/0aae55ba49ee0cb848b627dce061c565.jpg" },
        { id: 12, nom: "Patrons de mode été", categorie: "PATRONS", prix: 5000, image: "https://m.media-amazon.com/images/I/51cK4OsKWPL._AC_SY445_.jpg" },
        { id: 13, nom: "Aiguilles pour cuir", categorie: "OUTILS", prix: 2000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcFW-zBUP6vEOP-s2tG4wsob7rhu80fXN_vA&s" },
      ];

      setTousLesProduits(produits);
      setProduitsVedettes(produits.slice(0, 3));
      setMeilleuresVentes(produits.slice(3, 8));
      setNouveautes(produits.slice(8));
    };

    fetchData();
  }, []);

  const diapositiveSuivante = () => {
    setDiapositiveCourante((prev) => (prev + 1) % produitsVedettes.length);
  };

  const diapositivePrecedente = () => {
    setDiapositiveCourante((prev) => (prev - 1 + produitsVedettes.length) % produitsVedettes.length);
  };

  const filtrerProduitsParCategorie = (categorie) => {
    return tousLesProduits.filter(produit => produit.categorie === categorie);
  };

  const handleCategorieClick = (categorie) => {
    setCategorieSelectionnee(categorie);
  };

  const handleProductClick = (produit) => {
    navigate(`/product/${produit.id}`, { state: { product: produit } });
  };

  const produitsFiltres = categorieSelectionnee
    ? filtrerProduitsParCategorie(categorieSelectionnee)
    : tousLesProduits;

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="bg-purple-700 text-white p-4 mb-8">
          <ul className="flex justify-center space-x-4">
            {categories.map((categorie) => (
              <li key={categorie}>
                <button
                  onClick={() => handleCategorieClick(categorie)}
                  className={`px-3 py-2 rounded ${
                    categorieSelectionnee === categorie ? 'bg-white text-purple-700' : 'hover:bg-purple-600'
                  }`}
                >
                  {categorie}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {categorieSelectionnee ? (
          // Affichage des produits filtrés par catégorie
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{categorieSelectionnee}</h2>
            <div className="grid grid-cols-4 gap-4">
              {produitsFiltres.map(produit => (
                <div key={produit.id} className="border p-4 cursor-pointer" onClick={() => handleProductClick(produit)}>
                  <img src={produit.image} alt={produit.nom} className="w-full h-48 object-cover mb-2" />
                  <h3 className="font-semibold">{produit.nom}</h3>
                  <p className="text-purple-700 font-bold">{produit.prix} FCFA</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          // Affichage par défaut (carrousel, meilleures ventes, nouveautés)
          <>
            {/* Carrousel */}
            <div className="relative mb-12 h-[500px] overflow-hidden">
              {produitsVedettes.map((produit, index) => (
                <div
                  key={produit.id}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    index === diapositiveCourante ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
                  <div className="absolute bottom-8 left-8 bg-white bg-opacity-80 p-4">
                    <h2 className="text-2xl font-bold mb-2">{produit.nom}</h2>
                    <button className="bg-purple-700 text-white px-4 py-2" onClick={() => handleProductClick(produit)}>DÉCOUVRIR</button>
                  </div>
                </div>
              ))}
              <button onClick={diapositivePrecedente} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">
                <ChevronLeft />
              </button>
              <button onClick={diapositiveSuivante} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">
                <ChevronRight />
              </button>
            </div>

            {/* Meilleures ventes */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">NOS MEILLEURES VENTES</h2>
                <a href="#" className="text-purple-700">Voir tout</a>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {meilleuresVentes.map(produit => (
                  <div key={produit.id} className="border p-4 cursor-pointer" onClick={() => handleProductClick(produit)}>
                    <img src={produit.image} alt={produit.nom} className="w-full h-48 object-cover mb-2" />
                    <p className="text-sm text-gray-600">{produit.categorie}</p>
                    <h3 className="font-semibold">{produit.nom}</h3>
                    <p className="text-purple-700 font-bold">{produit.prix} FCFA</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Nouveautés */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">DERNIERS EN VENTE</h2>
                <a href="#" className="text-purple-700">Voir tout</a>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {nouveautes.map(produit => (
                  <div key={produit.id} className="border p-4 cursor-pointer" onClick={() => handleProductClick(produit)}>
                    <img src={produit.image} alt={produit.nom} className="w-full h-64 object-cover mb-2" />
                    <p className="text-sm text-gray-600">{produit.categorie}</p>
                    <h3 className="font-semibold">{produit.nom}</h3>
                    <p className="text-purple-700 font-bold">{produit.prix} FCFA</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}

// Ou si vous utilisez une exportation nommée :
// export function AchatVentePage() {
//   // Contenu du composant
// }
