import React from "react"; // Importation de la bibliothèque React
import { TbSocial } from "react-icons/tb"; // Importation d'une icône de social media
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks Redux pour gérer l'état global
import { Link } from "react-router-dom"; // Importation de Link pour la navigation entre les pages
import TextInput from "./TextInput"; // Importation du composant TextInput pour le champ de recherche
import CustomButton from "./CustomButton"; // Importation du composant CustomButton pour les boutons
import { useForm } from "react-hook-form"; // Importation du hook useForm pour gérer les formulaires
import { BsMoon, BsSunFill } from "react-icons/bs"; // Importation d'icônes pour le changement de thème
import { SetTheme } from "../redux/theme"; // Importation de l'action SetTheme pour changer le thème
import { Logout } from "../redux/userSlice"; // Importation de l'action Logout pour déconnexion
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"; // Importation d'une icône de chat
import NotificationDropdown from "./NotificationDropdown"; // Importation du composant NotificationDropdown pour les notifications

import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png"; // Importation de l'image du logo

const TopBar = () => {
  // Récupération de l'état du thème depuis Redux
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch(); // Initialisation du dispatch pour envoyer des actions
  const { register, handleSubmit } = useForm(); // Initialisation du hook de gestion de formulaire

  // Fonction pour changer le thème
  const handleTheme = () => {
    // Inverse le thème actuel
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue)); // Envoi de l'action pour changer le thème
  };

  // Fonction pour gérer la soumission du formulaire de recherche
  const handleSearch = async (data) => {
    // Traitement des données de recherche
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 px-4 bg-primary rounded-xl'>
      {/* Logo et lien vers la page d'accueil */}
      <Link to='/' className='flex gap-2 items-center'>
        <img src={LogoImage} alt="XartoumTech" className='h-10 md:h-16' />
      </Link>

      {/* Formulaire de recherche, caché sur mobile */}
      <form
        className='items-center justify-center hidden md:flex'
        onSubmit={handleSubmit(handleSearch)} // Gestion de la soumission du formulaire
      >
        <TextInput
          placeholder='Search...' // Placeholder du champ de recherche
          styles='w-[18rem] lg:w-[38rem] rounded-full py-3 ' // Styles du champ de recherche
          register={register("search")} // Enregistrement du champ avec react-hook-form
        />
        <CustomButton
          title='Search' // Titre du bouton de recherche
          type='submit' // Type du bouton
          containerStyles='bg-[#9a00d7] text-white px-6 py-2.5 mt-2 rounded-full ml-[-3rem]' // Styles du bouton
        />
      </form>

      {/* ICÔNES */}
      <div className='flex items-center gap-4 text-ascent-1 text-md md:text-xl'>
        {/* Bouton pour changer le thème */}
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />} {/* Affichage de l'icône en fonction du thème */}
        </button>

        {/* Lien vers la messagerie */}
        <Link to='/messagerie' className='relative'>
          <IoChatbubbleEllipsesOutline className='cursor-pointer' /> {/* Icône de chat */}
        </Link>
        
        {/* Composant de notifications */}
        <NotificationDropdown />

        <div>
          {/* Bouton de déconnexion */}
          <CustomButton
            onClick={() => dispatch(Logout())} // Déconnexion via l'action Redux
            title='Log Out' // Titre du bouton
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#9a00d7] rounded-full' // Styles du bouton
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar; // Exportation du composant TopBar
