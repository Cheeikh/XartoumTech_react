import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { makeRequest } from "../axios";
import { UserLogin } from "../redux/userSlice";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
  
  // Récupérer le message de succès d'inscription
  const registrationMessage = location.state?.message;

  useEffect(() => {
    if (registrationMessage) {
      toast.success(registrationMessage);
    }
  }, [registrationMessage]);

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
          className="m-0 p-0 font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-bgColor via-primary to-secondary transition-colors duration-300"
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
            className="form-container rounded-2xl p-8 w-full sm:w-3/4 md:w-2/5 max-w-[90vw] sm:max-w-[70vw] md:max-w-[37vw] shadow-xl mx-auto mt-8 md:mt-36 bg-primary backdrop-blur-md bg-opacity-80 dark:bg-opacity-90 border border-ascent-2/10"
        >
          <div className="form-title text-2xl sm:text-3xl font-bold mb-8 text-center text-ascent-1">
            Connectez-vous à votre compte
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-lg font-medium text-ascent-1">
                Adresse Email
              </label>
              <input
                  type="email"
                  id="email"
                  placeholder="Adresse Email"
                  className="input-field w-full p-4 border-2 border-ascent-2/20 rounded-xl text-lg bg-transparent text-ascent-1 placeholder-ascent-2/50 focus:border-[#9a00d7] focus:outline-none transition-colors duration-300"
                  {...register("email", {
                    required: "L'adresse email est requise",
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
                  })}
              />
              {errors.password && (
                  <span className="text-red-500 text-sm block mt-1">
                    {errors.password.message}
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
                    <span>Connexion en cours...</span>
                  </div>
              ) : (
                  "Se connecter"
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <Link
                  to="/reset-password"
                  className="text-[#9a00d7] hover:text-[#7b00ab] text-lg transition-colors duration-300"
              >
                Mot de passe oublié ?
              </Link>

              <div className="text-ascent-1">
                <span>Pas de compte ? </span>
                <Link to="/register" className="text-[#9a00d7] hover:text-[#7b00ab] font-medium transition-colors duration-300">
                  Créer un compte
                </Link>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
  );
};

export default Login;
