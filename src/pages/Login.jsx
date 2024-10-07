import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { CustomButton, Loading, TextInput } from "../components";
import { BgImage } from "../assets";
import { UserLogin } from "../redux/userSlice"; // Import correct thunk action
import { toast } from "react-toastify";
import { makeRequest } from "../axios";

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
        dispatch(UserLogin({
          user: response.data.user,
          token: response.data.token,
        }));

        // Stocker le token dans le localStorage
        localStorage.setItem("token", ( response.data.token));

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
      <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
        <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
          {/* LEFT */}
          <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
            <div className='w-full flex gap-2 items-center mb-6'>
              <div className='p-2 bg-[#065ad8] rounded text-white'>
                <TbSocial />
              </div>
              <span className='text-2xl text-[#065ad8] font-semibold'>
              XartoumTech
            </span>
            </div>

            <p className='text-ascent-1 text-base font-semibold'>
              Connectez-vous à votre compte
            </p>
            <span className='text-sm mt-2 text-ascent-2'>Bienvenue de retour</span>

            <form
                className='py-8 flex flex-col gap-5'
                onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                  name='email'
                  placeholder='email@example.com'
                  label='Adresse Email'
                  type='email'
                  register={register("email", {
                    required: "L'adresse email est requise",
                  })}
                  styles='w-full rounded-full'
                  labelStyle='ml-2'
                  error={errors.email ? errors.email.message : ""}
              />

              <TextInput
                  name='password'
                  label='Mot de Passe'
                  placeholder='Mot de Passe'
                  type='password'
                  styles='w-full rounded-full'
                  labelStyle='ml-2'
                  register={register("password", {
                    required: "Le mot de passe est requis!",
                  })}
                  error={errors.password ? errors.password.message : ""}
              />

              <Link
                  to='/reset-password'
                  className='text-sm text-right text-blue font-semibold'
              >
                Mot de passe oublié ?
              </Link>

              {errMsg && (
                  <span
                      className={`text-sm ${
                          errMsg !== "success"
                              ? "text-[#f64949fe]"
                              : "text-[#2ba150fe]"
                      } mt-0.5`}
                  >
                {errMsg}
              </span>
              )}

              {isSubmitting ? (
                  <Loading />
              ) : (
                  <CustomButton
                      type='submit'
                      containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                      title='Connexion'
                  />
              )}
            </form>

            <p className='text-ascent-2 text-sm text-center'>
              Vous n'avez pas de compte?
              <Link
                  to='/register'
                  className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
              >
                Créer un compte
              </Link>
            </p>
          </div>
          {/* RIGHT */}
          <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
            <div className='relative w-full flex items-center justify-center'>
              <img
                  src={BgImage}
                  alt='Bg Image'
                  className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
              />

              <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
                <BsShare size={14} />
                <span className='text-xs font-medium'>Partager</span>
              </div>

              <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
                <ImConnection />
                <span className='text-xs font-medium'>Connecter</span>
              </div>

              <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
                <AiOutlineInteraction />
                <span className='text-xs font-medium'>Interagir</span>
              </div>
            </div>

            <div className='mt-16 text-center'>
              <p className='text-white text-base'>
                Connectez-vous avec des amis & partagez pour vous amuser
              </p>
              <span className='text-sm text-white/80'>
              Partagez des souvenirs avec des amis et le monde entier.
            </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;
