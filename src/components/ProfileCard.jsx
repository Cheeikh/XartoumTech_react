import React from "react"; // Importation de la bibliothèque React
import { useDispatch, useSelector } from "react-redux"; // Importation des hooks pour utiliser Redux
import { Link } from "react-router-dom"; // Importation de Link pour la navigation
import { LiaEditSolid } from "react-icons/lia"; // Importation d'une icône pour l'édition
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from "react-icons/bs"; // Importation d'icônes pour diverses fonctionnalités
import { FaTwitterSquare } from "react-icons/fa"; // Importation de l'icône Twitter
import { CiLocationOn } from "react-icons/ci"; // Importation de l'icône de localisation
import moment from "moment"; // Importation de Moment.js pour le formatage de la date

import { NoProfile } from "../assets"; // Importation d'une image par défaut pour le profil
import { UpdateProfile } from "../redux/userSlice"; // Importation de l'action pour mettre à jour le profil

// Composant ProfileCard qui prend en entrée l'objet utilisateur
const ProfileCard = ({ user }) => {
  // Récupération des données utilisateur et de l'état d'édition depuis le store Redux
  const { user: data, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch(); // Création d'un dispatch pour envoyer des actions à Redux

  return (
    <div>
      {/* Conteneur principal de la carte de profil */}
      <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4 '>
        {/* En-tête de la carte avec le nom et l'image de profil */}
        <div className='w-full flex items-center justify-between border-b pb-5 border-[#9a00d7]'>
          {/* Lien vers la page de profil de l'utilisateur */}
          <Link to={"/profile/" + user.user?._id} className='flex gap-2'>
            {/* Affichage de l'image de profil, avec une image par défaut si aucune image n'est disponible */}
            <img
              src={user.user?.profileUrl ?? NoProfile}
              alt={user.user?.email}
              className='w-14 h-14 object-cover rounded-full'
            />

            {/* Affichage du nom complet de l'utilisateur et de sa profession */}
            <div className='flex flex-col justify-center'>
              <p className='text-lg font-medium text-ascent-1'>
                {user.user?.firstName} {user.user?.lastName}
              </p>
              <span className='text-ascent-2'>
                {user.user?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>

          {/* Icône d'édition ou bouton d'ajout d'ami */}
          <div className=''>
            {user?._id === data?._id ? (
              // Si l'utilisateur est le même que celui dans le store, afficher l'icône d'édition
              <LiaEditSolid
                size={22}
                className='text-[#9a00d7] cursor-pointer'
                onClick={() => dispatch(UpdateProfile(true))} // Dispatch de l'action pour activer l'édition
              />
            ) : (
              // Sinon, afficher un bouton pour ajouter comme ami
              <button

                className='bg-[#0444a430] text-sm text-ascent-1 p-1 rounded'
                onClick={() => {}} // Fonctionnalité d'ajout d'ami à implémenter
              >
                <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
              </button>
            )}
          </div>
        </div>

        {/* Informations supplémentaires de l'utilisateur */}
        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#9a00d7]'>
          <div className='flex gap-2 items-center text-ascent-2'>

            <CiLocationOn className='text-xl text-[#7e22ce]' />
            <span>{user?.user.location ?? "Add Location"}</span>
          </div>

          <div className='flex gap-2 items-center text-ascent-2'>

            <BsBriefcase className=' text-lg text-[#7e22ce]' />
            <span>{user.user?.profession ?? "Add Profession"}</span>
          </div>
        </div>

        {/* Informations sur les amis et les vues du profil */}
        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#9a00d7]'>
          <p className='text-xl text-ascent-1 font-semibold'>
            {user.user?.friends?.length} Friends
          </p>

          <div className='flex items-center justify-between'>
            <span className='text-ascent-2'>Who viewed your profile</span>
            <span className='text-ascent-1 text-lg'>{user.user?.views?.length}</span>
          </div>

          {/* Statut de vérification du compte */}
          <span className='text-base text-[#9a00d7]'>
            {user.user?.verified ? "Verified Account" : "Not Verified"}
          </span>

          <div className='flex items-center justify-between'>
            <span className='text-ascent-2'>Joined</span>
            <span className='text-ascent-1 text-base'>
              {moment(user.user?.createdAt).fromNow()} {/* Affichage de la date d'inscription */}
            </span>
          </div>
        </div>

        {/* Section pour les profils sociaux */}
        <div className='w-full flex flex-col gap-4 py-4 pb-6'>
          <p className='text-ascent-1 text-lg font-semibold'>Social Profile</p>

          {/* Liens vers les profils sociaux */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <BsInstagram className=' text-xl  text-[#7e22ce]' />
            <span>Instagram</span>
          </div>
          <div className='flex gap-2 items-center text-ascent-2'>
            <FaTwitterSquare className=' text-xl text-[#7e22ce]' />
            <span>Twitter</span>
          </div>
          <div className='flex gap-2 items-center text-ascent-2'>
            <BsFacebook className=' text-xl text-[#7e22ce]' />
            <span>Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; // Exportation du composant ProfileCard
