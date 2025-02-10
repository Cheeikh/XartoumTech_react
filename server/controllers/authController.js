// controllers/authController.js
import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Valider les champs
  if (!(firstName && lastName && email && password)) {
    return res.status(400).json({ message: "Fournir les champs requis !" });
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "L'adresse email existe déjà" });
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Envoyer l'e-mail de vérification à l'utilisateur
    await sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Veuillez fournir les informations de l'utilisateur" });
    }

    // Trouver l'utilisateur par email
    const user = await Users.findOne({ email })
        .select("+password")
        .populate({
          path: "friends",
          select: "firstName lastName location profileUrl -password",
        });

    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe invalide" });
    }

    if (!user.verified) {
      return res.status(400).json({
        message:
            "L'email de l'utilisateur n'est pas vérifiée. Vérifiez votre compte email et vérifiez votre email",
      });
    }

    // Comparer le mot de passe
    const isMatch = await compareString(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe invalide" });
    }

    user.password = undefined;

    const token = createJWT(user._id); // Assurez-vous que cette fonction crée un token avec { userId: ... }

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
