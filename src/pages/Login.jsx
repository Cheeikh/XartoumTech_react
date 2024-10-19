import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { makeRequest } from "../axios";
import { UserLogin } from "../redux/userSlice";
import { motion } from "framer-motion";

import BackgroundImage from "../assets/top-view-fabrics-with-thread-copy-space.png";
import LogoImage from "../assets/freepik-flat-hand-drawn-long-dress-clothing-store-logo-20241012174920OUdL.png";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Déterminer où rediriger après la connexion
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg(""); // Réinitialiser le message d'erreur

    try {
      // Envoyer la requête de connexion au backend
      const response = await makeRequest.post("/auth/login", data);

      if (response.data.success) {
        // Déclencher l'action de connexion avec les données utilisateur et le token
        dispatch(
            UserLogin({
              user: response.data.user,
              token: response.data.token,
            })
        );

        // Stocker le token dans le localStorage
        localStorage.setItem("token", response.data.token);

        // Afficher une notification de succès
        toast.success(response.data.message);

        // Rediriger l'utilisateur vers la page précédente ou la page d'accueil
        navigate(from, { replace: true });
      } else {
        // Afficher le message d'erreur provenant du backend
        setErrMsg(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      // Afficher un message d'erreur générique ou spécifique
      setErrMsg(error.response?.data?.message || "Erreur de connexion.");
      toast.error(error.response?.data?.message || "Erreur de connexion.");
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
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="absolute right-[7vw] top-[4vh] w-[20vw] h-[20vw] bg-no-repeat bg-contain hidden md:block"
            style={{
              backgroundImage: `url(${LogoImage})`,
            }}
        ></motion.div>
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="form-container rounded-2xl p-4 sm:p-8 md:p-12 w-full sm:w-3/4 md:w-2/5 max-w-[90vw] sm:max-w-[70vw] md:max-w-[37vw] shadow-md mx-auto mt-8 md:mt-36 bg-primary bg-opacity-90"
        >
          <div className="form-title text-xl sm:text-2xl font-bold mb-6 text-center">
            Connectez-vous à votre compte
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="block text-lg font-medium">
              Adresse Email
            </label>
            <input
                type="email"
                id="email"
                placeholder="Adresse Email"
                className="input-field w-full p-4 mb-4 border-2 border-[#9a00d7] rounded-full text-lg mt-2"
                {...register("email", {
                  required: "L'adresse email est requise",
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
                })}
            />
            {errors.password && (
                <span className="text-red-500 text-sm mb-4 block">
              {errors.password.message}
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
                className="button w-full py-3 bg-[#9a00d7] text-ascent-1 text-lg border-none rounded-full cursor-pointer mt-6"
                disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion..." : "Connexion"}
            </button>
          </form>
          <a
              href="/reset-password"
              className="forgot-password block mt-4 text-right text-lg text-[#9a00d7]"
          >
            Mot de passe oublié ?
          </a>
          <div className="create-account-container text-center mt-6">
          <span>
            Vous n’avez pas de compte ?{" "}
            <Link to="/register" className="create-account text-[#9a00d7]">
              Créer un compte
            </Link>
          </span>
          </div>
        </motion.div>
      </div>
  );
};

export default Login;
