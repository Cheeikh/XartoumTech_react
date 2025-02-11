import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { makeRequest } from "../axios";
import BackgroundImage from "../assets/top-view-fabrics-with-thread-copy-space.png";
import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png";
import { motion } from "framer-motion";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg(""); // Réinitialiser le message d'erreur

    try {
      // Envoyer la requête d'inscription au backend
      const response = await makeRequest.post("/auth/register", data);

      if (response.data.success) {
        // Afficher une notification de succès
        toast.success(response.data.message);

        // Rediriger l'utilisateur vers la page de connexion
        navigate("/login", { 
          state: { 
            registrationSuccess: true, 
            message: "Un mail vous a été envoyé. Veuillez vérifier votre boîte de réception." 
          } 
        });
      } else {
        // Afficher le message d'erreur provenant du backend
        setErrMsg(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      // Afficher un message d'erreur générique ou spécifique
      setErrMsg(error.response?.data?.message || "Erreur d'inscription.");
      toast.error(error.response?.data?.message || "Erreur d'inscription.");
    }

    setIsSubmitting(false);
  };

  return (
      <div
          className="m-0 p-0 font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-bgColor via-primary to-secondary transition-colors duration-300"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
          }}
      >
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[30vw] h-[30vh] bg-no-repeat bg-contain hidden md:block"
            style={{
              backgroundImage: `url(${LogoImage})`,
            }}
        ></motion.div>
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="form-container rounded-2xl p-8 w-full sm:w-3/4 md:w-2/5 max-w-[90vw] sm:max-w-[70vw] md:max-w-[37vw] shadow-xl mx-auto mt-8 md:mt-4 bg-primary backdrop-blur-md bg-opacity-80 dark:bg-opacity-90 border border-ascent-2/10"
        >
          <div className="form-title text-2xl sm:text-3xl font-bold mb-8 text-center text-ascent-1">
            Créez votre compte
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <label htmlFor="firstName" className="block text-lg font-medium text-ascent-1">
                  Prénom
                </label>
                <input
                    type="text"
                    id="firstName"
                    placeholder="Prénom"
                    className="input-field w-full p-4 border-2 border-ascent-2/20 rounded-xl text-lg bg-transparent text-ascent-1 placeholder-ascent-2/50 focus:border-[#9a00d7] focus:outline-none transition-colors duration-300"
                    {...register("firstName", {
                      required: "Le prénom est requis!",
                    })}
                />
                {errors.firstName && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.firstName.message}
                    </span>
                )}
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                <label htmlFor="lastName" className="block text-lg font-medium text-ascent-1">
                  Nom
                </label>
                <input
                    type="text"
                    id="lastName"
                    placeholder="Nom"
                    className="input-field w-full p-4 border-2 border-ascent-2/20 rounded-xl text-lg bg-transparent text-ascent-1 placeholder-ascent-2/50 focus:border-[#9a00d7] focus:outline-none transition-colors duration-300"
                    {...register("lastName", {
                      required: "Le nom est requis!",
                    })}
                />
                {errors.lastName && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.lastName.message}
                    </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-lg font-medium text-ascent-1">
                Adresse Email
              </label>
              <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  className="input-field w-full p-4 border-2 border-ascent-2/20 rounded-xl text-lg bg-transparent text-ascent-1 placeholder-ascent-2/50 focus:border-[#9a00d7] focus:outline-none transition-colors duration-300"
                  {...register("email", {
                    required: "L'adresse email est requise",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Adresse email invalide",
                    },
                  })}
              />
              {errors.email && (
                  <span className="text-red-500 text-sm block mt-1">
                    {errors.email.message}
                  </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-lg font-medium text-ascent-1">
                Mot de Passe
              </label>
              <input
                  type="password"
                  id="password"
                  placeholder="Mot de Passe"
                  className="input-field w-full p-4 border-2 border-ascent-2/20 rounded-xl text-lg bg-transparent text-ascent-1 placeholder-ascent-2/50 focus:border-[#9a00d7] focus:outline-none transition-colors duration-300"
                  {...register("password", {
                    required: "Le mot de passe est requis!",
                    minLength: {
                      value: 6,
                      message: "Le mot de passe doit comporter au moins 6 caractères",
                    },
                  })}
              />
              {errors.password && (
                  <span className="text-red-500 text-sm block mt-1">
                    {errors.password.message}
                  </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="cPassword" className="block text-lg font-medium text-ascent-1">
                Confirmez le Mot de Passe
              </label>
              <input
                  type="password"
                  id="cPassword"
                  placeholder="Confirmez le Mot de Passe"
                  className="input-field w-full p-4 border-2 border-ascent-2/20 rounded-xl text-lg bg-transparent text-ascent-1 placeholder-ascent-2/50 focus:border-[#9a00d7] focus:outline-none transition-colors duration-300"
                  {...register("cPassword", {
                    validate: (value) => {
                      const { password } = getValues();
                      return password === value || "Les mots de passe ne correspondent pas";
                    },
                  })}
              />
              {errors.cPassword && (
                  <span className="text-red-500 text-sm block mt-1">
                    {errors.cPassword.message}
                  </span>
              )}
            </div>

            {errMsg && (
                <span
                    className={`text-sm ${
                        errMsg !== "success" ? "text-red-500" : "text-green-500"
                    } mt-2 block`}
                >
                  {errMsg}
                </span>
            )}

            <button
                type="submit"
                className="button w-full py-4 bg-[#9a00d7] hover:bg-[#7b00ab] text-white text-lg font-semibold rounded-xl cursor-pointer transition-colors duration-300 flex items-center justify-center"
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Création du compte...</span>
                  </div>
              ) : (
                  "Créer un Compte"
              )}
            </button>

            <div className="text-center text-ascent-1">
              <span>Vous avez déjà un compte ? </span>
              <Link to="/login" className="text-[#9a00d7] hover:text-[#7b00ab] font-medium transition-colors duration-300">
                Connectez-vous
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
  );
};

export default Register;
