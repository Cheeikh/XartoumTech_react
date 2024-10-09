import mongoose from "mongoose";
import Verification from "../models/emailVerification.js";
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import PasswordReset from "../models/PasswordReset.js";
import { resetPasswordLink } from "../utils/sendEmail.js";
import FriendRequest from "../models/friendRequest.js";

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const result = await Verification.findOne({ userId });

    if (result) {
      const { expiresAt, token: hashedToken } = result;

      // token has expires
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification token has expired.";
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((err) => {
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        //token valid
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Users.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "Email verified successfully";
                    res.redirect(
                      `/users/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "Verification failed or link is invalid";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              // invalid token
              const message = "Verification failed or link is invalid";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link. Try again later.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(err);
    res.redirect(`/users/verified?message=`);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "Email address not found.",
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "PENDING",
          message: "Reset password link has already been sent tp your email.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;

  try {
    // find record
    const user = await Users.findById(userId);

    if (!user) {
      const message = "Invalid password reset link. Try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }

    const resetPassword = await PasswordReset.findOne({ userId });

    if (!resetPassword) {
      const message = "Invalid password reset link. Try again";
      return res.redirect(
        `/users/resetpassword?status=error&message=${message}`
      );
    }

    const { expiresAt, token: resetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      const message = "Reset Password link has expired. Please try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);

      if (!isMatch) {
        const message = "Invalid reset password link. Please try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const hashedpassword = await hashString(password);

    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { password: hashedpassword }
    );

    if (user) {
      await PasswordReset.findOneAndDelete({ userId });

      res.status(200).json({
        ok: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    let userId;

    if (req.params.id) {
      // Si un ID est fourni dans les paramètres, on l'utilise pour récupérer l'utilisateur spécifié
      userId = req.params.id;
    } else if (req.user && req.user._id) {
      // Sinon, on utilise l'ID de l'utilisateur authentifié
      userId = req.user._id;
    } else {
      // Si aucun ID n'est disponible, on renvoie une erreur
      return res.status(400).json({
        success: false,
        message: "Aucun ID d'utilisateur fourni",
      });
    }

    // Récupérer l'utilisateur par son ID
    const user = await Users.findById(userId).populate({
      path: "friends",
      select: "-password", // Exclure le mot de passe des amis
    });

    if (!user) {
      return res.status(404).send({
        message: "Utilisateur non trouvé",
        success: false,
      });
    }

    // Supprimer le mot de passe avant de retourner la réponse
    user.password = undefined;

    // Répondre avec les données de l'utilisateur
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      success: false,
      error: error.message,
    });
  }
};



export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, location, profileUrl, profession } = req.body;

    if (!(firstName || lastName || contact || profession || location)) {
      next("Please provide all required fields");
      return;
    }

    const { userId } = req.body.user;

    const updateUser = {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      _id: userId,
    };
    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" });
    const token = createJWT(user?._id);

    user.password = undefined;

    res.status(200).json({
      sucess: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const friendRequest = async (req, res) => {
  try {
    const userId = req.user._id; // ID de l'utilisateur authentifié
    const { requestTo } = req.body;

    if (!requestTo) {
      return res.status(400).json({
        success: false,
        message: "L'ID de l'utilisateur à ajouter est requis.",
      });
    }

    // Vérifier si l'utilisateur essaie d'envoyer une demande à lui-même
    if (userId.toString() === requestTo) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas envoyer une demande d'ami à vous-même.",
      });
    }

    // Vérifier si l'utilisateur cible existe
    const targetUser = await Users.findById(requestTo);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur cible non trouvé.",
      });
    }

    // Vérifier si les utilisateurs sont déjà amis
    if (
      targetUser.friends.includes(userId) ||
      req.user.friends.includes(requestTo)
    ) {
      return res.status(400).json({
        success: false,
        message: "Vous êtes déjà amis avec cet utilisateur.",
      });
    }

    // Vérifier si une demande d'ami a déjà été envoyée ou reçue
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { requestFrom: userId, requestTo },
        { requestFrom: requestTo, requestTo: userId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          existingRequest.requestFrom.toString() === userId.toString()
            ? "Demande d'ami déjà envoyée."
            : "Cet utilisateur a déjà envoyé une demande d'ami.",
      });
    }

    // Créer une nouvelle demande d'ami
    const newFriendRequest = await FriendRequest.create({
      requestFrom: userId,
      requestTo,
    });

    // Optionnel : Ajouter une notification pour l'utilisateur cible
    // await Notification.create({
    //   user: requestTo,
    //   type: "friend_request",
    //   message: `${req.user.firstName} vous a envoyé une demande d'ami.`,
    // });

    res.status(201).json({
      success: true,
      message: "Demande d'ami envoyée avec succès.",
      data: newFriendRequest,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande d'ami :", error);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur lors de l'envoi de la demande d'ami.",
      error: error.message,
    });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id; // Utilisation de req.user._id

    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession -password",
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const userId = req.user._id; // Utilisation de req.user._id

    const { rid, status } = req.body;

    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next("No Friend Request Found.");
      return;
    }

    const updatedRequest = await FriendRequest.findByIdAndUpdate(
      { _id: rid },
      { requestStatus: status }
    );

    if (status === "Accepted") {
      const user = await Users.findById(userId);

      user.friends.push(updatedRequest?.requestFrom);

      await user.save();

      const friend = await Users.findById(updatedRequest?.requestFrom);

      friend.friends.push(updatedRequest?.requestTo);

      await friend.save();
    }

    res.status(201).json({
      success: true,
      message: "Friend Request " + status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const suggestedFriends = async (req, res) => {
  try {
    const userId = req.user._id; // Utilisation de req.user._id

    let queryObject = {};

    queryObject._id = { $ne: userId };
    queryObject.friends = { $nin: userId };

    let queryResult = Users.find(queryObject)
      .limit(15)
      .select("firstName lastName profileUrl profession -password");

    const suggestedFriends = await queryResult;

    res.status(200).json({
      success: true,
      data: suggestedFriends,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


export const profileViews = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.body;

    const user = await Users.findById(id);

    user.views.push(userId);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};