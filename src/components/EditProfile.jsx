import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdateProfileModal, UpdateUser } from "../redux/userSlice";
import { makeRequest } from "../axios";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg("");

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("profession", data.profession);
      formData.append("location", data.location);

      if (picture) {
        formData.append("profileUrl", picture);
      }

      const response = await makeRequest.put("/users/update-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        dispatch(UpdateUser(response.data.user));
        toast.success(response.data.message);
        dispatch(UpdateProfileModal(false));
      } else {
        setErrMsg(response.data.message || "Échec de la mise à jour du profil.");
        toast.error(response.data.message || "Échec de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      setErrMsg(error.response?.data?.message || "Échec de la mise à jour du profil.");
      toast.error(error.response?.data?.message || "Échec de la mise à jour du profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    dispatch(UpdateProfileModal(false));
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePicture = () => {
    setPicture(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Modifier le Profil
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="firstName"
                label="Prénom"
                placeholder="Prénom"
                type="text"
                styles="w-full"
                register={register("firstName", {
                  required: "Le prénom est requis!",
                })}
                error={errors.firstName ? errors.firstName.message : ""}
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
                    accept=".jpg, .png, .jpeg"
                  />
                  <span>Sélectionner une photo de profil</span>
                </label>

                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePicture}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                )}
              </div>

              {errMsg && (
                <span role="alert" className="text-sm text-[#f64949fe] mt-0.5">
                  {errMsg}
                </span>
              )}

              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmitting ? (
                  <Loading />
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