import React, { useState } from "react";
// Importation de React et du hook useState pour gérer les états locaux dans le composant.

import { useForm } from "react-hook-form";
// Importation de useForm de 'react-hook-form', un hook pour la gestion des formulaires avec validation.

import { MdClose, MdDelete } from "react-icons/md";
// Importation d'icônes pour la fermeture et la suppression à partir de la bibliothèque 'react-icons'.

import { useDispatch, useSelector } from "react-redux";
// Utilisation des hooks Redux : useSelector pour lire les données du store et useDispatch pour envoyer des actions.

import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
// Importation de composants personnalisés : un champ de texte, une animation de chargement et un bouton.

import { UpdateProfileModal, UpdateUser } from "../redux/userSlice";
// Actions de Redux pour mettre à jour les informations utilisateur et gérer l'état du modal.

import { makeRequest } from "../axios";
// Importation de l'instance Axios pour faire des requêtes HTTP.

import { toast } from "react-toastify";
// Importation de 'react-toastify' pour afficher des notifications toast (succès ou erreur).

const EditProfile = () => {
  // Accès aux données utilisateur dans le store Redux avec useSelector.
  const { user } = useSelector((state) => state.user);

  // Initialisation du dispatch Redux pour envoyer des actions.
  const dispatch = useDispatch();

  // Déclaration des états locaux pour gérer les erreurs, le statut de soumission, et l'image de profil.
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Utilisation de useForm pour gérer le formulaire, avec des valeurs par défaut provenant de l'utilisateur connecté.
  const {
    register, // Pour enregistrer les champs du formulaire.
    handleSubmit, // Gère la soumission du formulaire.
    formState: { errors }, // Récupère les erreurs de validation.
  } = useForm({
    mode: "onChange", // Valide à chaque changement de champ.
    defaultValues: { ...user }, // Initialise les champs avec les données de l'utilisateur actuel.
  });

  // Fonction appelée lors de la soumission du formulaire.
  const onSubmit = async (data) => {
    setIsSubmitting(true); // Active l'état de soumission (pour afficher l'animation de chargement).
    setErrMsg(""); // Réinitialise le message d'erreur.

    try {
      const formData = new FormData();
      // Crée un objet FormData pour envoyer les données du formulaire, y compris les fichiers.

      // Ajout des données du formulaire à l'objet FormData.
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("profession", data.profession);
      formData.append("location", data.location);

      // Ajout de l'image de profil si elle est présente.
      if (picture) {
        formData.append("profileUrl", picture);
      }

      // Affichage des données envoyées pour le débogage.
      console.log("FormData content:", Object.fromEntries(formData));

      // Envoi de la requête PUT au serveur pour mettre à jour les informations utilisateur.
      const response = await makeRequest.put("/users/update-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Type de contenu pour l'envoi de fichiers.
        },
      });

      console.log("Server response:", response.data); // Affichage de la réponse du serveur pour le débogage.

      // Si la mise à jour est un succès, on met à jour l'utilisateur dans le store Redux.
      if (response.data.success) {
        dispatch(UpdateUser(response.data.user));
        toast.success(response.data.message); // Affichage d'une notification de succès.
        dispatch(UpdateProfileModal(false)); // Fermeture du modal après la mise à jour.
      } else {
        // Gestion des erreurs si la réponse du serveur indique un échec.
        setErrMsg(response.data.message || "Échec de la mise à jour du profil.");
        toast.error(response.data.message || "Échec de la mise à jour du profil.");
      }
    } catch (error) {
      // Gestion des erreurs (ex: problème réseau ou autre erreur).
      console.error("Erreur détaillée lors de la mise à jour du profil :", error);
      setErrMsg(error.response?.data?.message || "Échec de la mise à jour du profil.");
      toast.error(error.response?.data?.message || "Échec de la mise à jour du profil.");
    } finally {
      // Réinitialisation de l'état de soumission après la réponse (réussite ou échec).
      setIsSubmitting(false);
    }
  };

  // Fonction pour fermer le modal lorsque l'utilisateur clique sur le bouton de fermeture.
  const handleClose = () => {
    dispatch(UpdateProfileModal(false)); // Ferme le modal en envoyant une action au store Redux.
  };

  // Fonction pour gérer la sélection d'une image dans le champ d'upload.
  const handleSelect = (e) => {
    const file = e.target.files[0]; // Récupère le premier fichier sélectionné par l'utilisateur.
    if (file) {
      setPicture(file); // Met à jour l'état avec l'image sélectionnée.
      setPreviewUrl(URL.createObjectURL(file)); // Génère une URL d'aperçu de l'image.
    }
  };

  // Fonction pour supprimer l'image sélectionnée (réinitialise l'état).
  const handleRemovePicture = () => {
    setPicture(null);
    setPreviewUrl(null); // Supprime l'URL d'aperçu.
  };

  return (
      <>
        <div className="fixed z-50 inset-0 overflow-y-auto">
          {/* Positionnement fixe et superposition du modal */}
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-[#000] opacity-70"></div>
              {/* Fond sombre avec opacité pour l'effet de modal */}
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div
                className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
            >
              {/* Conteneur du modal pour le formulaire de modification de profil */}
              <div className="flex justify-between px-6 pt-5 pb-2">
                <label
                    htmlFor="name"
                    className="block font-medium text-xl text-ascent-1 text-left"
                >
                  Modifier le Profil
                </label>
                <button className="text-ascent-1" onClick={handleClose}>
                  <MdClose size={22} />
                  {/* Bouton pour fermer le modal */}
                </button>
              </div>
              <form
                  className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
                  onSubmit={handleSubmit(onSubmit)}
                  // Envoie le formulaire avec la fonction handleSubmit (de react-hook-form).
              >
                {/* Champs de texte pour le prénom, le nom, la profession et la localisation */}
                <TextInput
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom"
                    type="text"
                    styles="w-full"
                    register={register("firstName", {
                      required: "Le prénom est requis!",
                      // Message d'erreur si le champ est vide.
                    })}
                    error={errors.firstName ? errors.firstName.message : ""}
                    // Affiche l'erreur si le champ n'est pas rempli.
                />

                <TextInput
                    name="lastName"
                    label="Nom"
                    placeholder="Nom"
                    type="text"
                    styles="w-full"
                    register={register("lastName", {
                      required: "Le nom est requis!",
                    })}
                    error={errors.lastName ? errors.lastName.message : ""}
                />

                <TextInput
                    name="profession"
                    label="Profession"
                    placeholder="Profession"
                    type="text"
                    styles="w-full"
                    register={register("profession", {
                      required: "La profession est requise!",
                    })}
                    error={errors.profession ? errors.profession.message : ""}
                />

                <TextInput
                    name="location"
                    label="Localisation"
                    placeholder="Localisation"
                    type="text"
                    styles="w-full"
                    register={register("location", {
                      required: "La localisation est requise!",
                    })}
                    error={errors.location ? errors.location.message : ""}
                />

                {/* Section pour la sélection et l'aperçu de l'image de profil */}
                <div className="flex flex-col items-center gap-2">
                  <label
                      className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                      htmlFor="imgUpload"
                  >
                    <input
                        type="file"
                        className="hidden"
                        id="imgUpload"
                        onChange={handleSelect}
                        // Appel de la fonction handleSelect lors de la sélection d'un fichier.
                        accept=".jpg, .png, .jpeg"
                        // Restriction des types de fichiers acceptés.
                    />
                    <span>Sélectionner une photo de profil</span>
                  </label>

                  {/* Affichage de l'aperçu de l'image sélectionnée */}
                  {previewUrl && (
                      <div className="relative">
                        <img
                            src={previewUrl}
                            // Affiche l'URL de l'image générée pour l'aperçu.
                            alt="Aperçu"
                            className="w-32 h-32 object-cover rounded-full"
                        />
                        <button
                            type="button"
                            onClick={handleRemovePicture}
                            // Supprime l'image sélectionnée.
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <MdDelete size={20} />
                          {/* Icône pour supprimer l'image */}
                        </button>
                      </div>
                  )}
                </div>

                {/* Message d'erreur en cas de problème */}
                {errMsg && (
                    <span role="alert" className="text-sm text-[#f64949fe] mt-0.5">
                  {errMsg}
                </span>
                )}

                {/* Bouton de soumission ou animation de chargement */}
                <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                  {isSubmitting ? (
                      <Loading />
                      // Affiche l'animation de chargement si la soumission est en cours.
                  ) : (
                      <CustomButton
                          type="submit"
                          containerStyles="inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none"
                          title="Soumettre"
                      />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
  );
};

export default EditProfile;
