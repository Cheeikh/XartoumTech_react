// PostCreator.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { makeRequest } from "../axios";
import { TextInput, CustomButton } from "../components";
import { BiImages } from "react-icons/bi";
import { NoProfile } from "../assets";

const PostCreator = ({ onPostCreated }) => {
  const { user } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePostSubmit = async (data) => {
    try {
      setPosting(true);
      setErrMsg("");
      setSuccessMsg("");

      const formData = new FormData();
      formData.append("description", data.description);

      if (file) {
        formData.append("media", file);
      }

      const response = await makeRequest.post("/posts/create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Ajouter le nouveau post à la liste
      onPostCreated(response.data.data);

      setSuccessMsg("Post créé avec succès !");
      setPosting(false);
      setFile(null);
      setImagePreview(null);
      reset();
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
      setErrMsg("Échec de la création du post.");
      setPosting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handlePostSubmit)}
      className="bg-primary px-4 rounded-lg"
    >
      <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
        <img
          src={user?.user?.profileUrl ?? NoProfile}
          alt="User Image"
          className="w-14 h-14 rounded-full object-cover"
        />
        <TextInput
          styles="w-full rounded-full py-5"
          placeholder="Quoi de neuf ?"
          name="description"
          register={register("description", {
            required: "Écrivez quelque chose pour le post",
          })}
          error={errors.description ? errors.description.message : ""}
        />
      </div>
      {errMsg && (
        <span role="alert" className="text-sm text-[#f64949fe] mt-0.5">
          {errMsg}
        </span>
      )}
      {successMsg && (
        <span role="status" className="text-sm text-[#2ba150fe] mt-0.5">
          {successMsg}
        </span>
      )}

      {/* Aperçu du fichier */}
      {imagePreview && (
        <div className="w-full mt-4">
          {file?.type.startsWith("image/") ? (
            <img
              src={imagePreview}
              alt="Aperçu du média"
              className="w-full rounded-lg object-cover"
            />
          ) : file?.type.startsWith("video/") ? (
            <video
              className="w-full rounded-lg object-cover"
              autoPlay
              loop
              muted
            >
              <source src={imagePreview} type={file.type} />
              Votre navigateur ne supporte pas la lecture des vidéos.
            </video>
          ) : (
            <p>Format non supporté pour l'aperçu.</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between py-4">
        <label
          htmlFor="mediaUpload"
          className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="mediaUpload"
            accept=".jpg, .png, .jpeg, .mp4, .wav, .gif"
          />
          <BiImages />
          <span>Média</span>
        </label>

        <div>
          <CustomButton
            type="submit"
            title={posting ? "Publication..." : "Publier"}
            containerStyles={`${
              posting
                ? "bg-[#0444a4] opacity-50 cursor-not-allowed"
                : "bg-[#0444a4]"
            } text-white py-1 px-6 rounded-full font-semibold text-sm`}
            disabled={posting}
          />
        </div>
      </div>
    </form>
  );
};

export default PostCreator;
