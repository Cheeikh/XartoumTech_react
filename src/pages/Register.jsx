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
        navigate("/login");
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
          className="m-0 p-0 font-sans bg-cover min-h-screen flex items-center justify-center"
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
            className="form-container rounded-2xl p-4 sm:p-8 md:p-12 w-full sm:w-3/4 md:w-2/5 max-w-[90vw] sm:max-w-[70vw] md:max-w-[37vw] shadow-md mx-auto mt-8 md:mt-4 bg-white bg-opacity-90"
        >
          <div className="form-title text-xl sm:text-2xl font-bold mb-6 text-center">
            Créez votre compte
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full md:w-1/2">
                <label htmlFor="firstName" className="block text-lg font-medium">
                  Prénom
                </label>
                <input
                    type="text"
                    id="firstName"
                    placeholder="Prénom"
                    className="input-field w-full p-4 mb-2 border-2 border-[#9a00d7] rounded-full text-lg mt-2"
                    {...register("firstName", {
                      required: "Le prénom est requis!",
                    })}
                />
                {errors.firstName && (
                    <span className="text-red-500 text-sm block">
                  {errors.firstName.message}
                </span>
                )}
              </div>
              <div className="w-full md:w-1/2">
                <label htmlFor="lastName" className="block text-lg font-medium">
                  Nom
                </label>
                <input
                    type="text"
                    id="lastName"
                    placeholder="Nom"
                    className="input-field w-full p-4 mb-2 border-2 border-[#9a00d7] rounded-full text-lg mt-2"
                    {...register("lastName", {
                      required: "Le nom est requis!",
                    })}
                />
                {errors.lastName && (
                    <span className="text-red-500 text-sm block">
                  {errors.lastName.message}
                </span>
                )}
              </div>
            </div>

            <label htmlFor="email" className="block text-lg font-medium">
              Adresse Email
            </label>
            <input
                type="email"
                id="email"
                placeholder="email@example.com"
                className="input-field w-full p-4 mb-4 border-2 border-[#9a00d7] rounded-full text-lg mt-2"
                {...register("email", {
                  required: "L'adresse email est requise",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Adresse email invalide",
                  },
                })}
            />
            {errors.email && (
                <span className="text-red-500 text-sm mb-4 block">
              {errors.email.message}
            </span>
            )}

            <label htmlFor="password" className="block text-lg font-medium">
              Mot de Passe
            </label>
            <input
                type="password"
                id="password"
                placeholder="Mot de Passe"
                className="input-field w-full p-4 mb-4 border-2 border-[#9a00d7] rounded-full text-lg mt-2"
                {...register("password", {
                  required: "Le mot de passe est requis!",
                  minLength: {
                    value: 6,
                    message: "Le mot de passe doit comporter au moins 6 caractères",
                  },
                })}
            />
            {errors.password && (
                <span className="text-red-500 text-sm mb-4 block">
              {errors.password.message}
            </span>
            )}

            <label htmlFor="cPassword" className="block text-lg font-medium">
              Confirmez le Mot de Passe
            </label>
            <input
                type="password"
                id="cPassword"
                placeholder="Confirmez le Mot de Passe"
                className="input-field w-full p-4 mb-4 border-2 border-[#9a00d7] rounded-full text-lg mt-2"
                {...register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();
                    return (
                        password === value || "Les mots de passe ne correspondent pas"
                    );
                  },
                })}
            />
            {errors.cPassword && (
                <span className="text-red-500 text-sm mb-4 block">
              {errors.cPassword.message}
            </span>
            )}

            {errMsg && (
                <span
                    className={`text-sm ${
                        errMsg !== "success" ? "text-red-500" : "text-green-500"
                    } mt-0.5 block`}
                >
              {errMsg}
            </span>
            )}

            <button
                type="submit"
                className="button w-full py-3 bg-[#9a00d7] text-white text-lg border-none rounded-full cursor-pointer mt-6"
                disabled={isSubmitting}
            >
              {isSubmitting ? "Création du compte..." : "Créer un Compte"}
            </button>
          </form>

          <div className="login-link-container text-center mt-6">
          <span>
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="login-link text-[#9a00d7]">
              Connectez-vous
            </Link>
          </span>
          </div>
        </motion.div>
      </div>
  );
};

export default Register;
