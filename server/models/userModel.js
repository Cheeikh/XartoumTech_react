import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 characters"],
      select: false, // Le mot de passe est généralement exclu par défaut
    },
    location: { type: String },
    profileUrl: { type: String },
    profession: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    views: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    verified: { type: Boolean, default: false },
    following: [{ type: Schema.Types.ObjectId, ref: "Users" }], // Utilisateurs suivis
    followers: [{ type: Schema.Types.ObjectId, ref: "Users" }], // Utilisateurs qui suivent

    // Champs supplémentaires
    dailyPostCredits: {
      type: Number,
      default: 5, // Crédits par défaut
    },
    lastCreditReset: {
      type: Date,
      default: Date.now,
    },
    purchasedCredits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Méthode pour vérifier et réinitialiser les crédits quotidiens
userSchema.methods.checkAndResetDailyCredits = function () {
  const now = new Date();
  const lastReset = this.lastCreditReset;

  // Comparer les dates (jour, mois, année)
  if (
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    this.dailyPostCredits = 5; // Réinitialiser à la valeur par défaut
    this.lastCreditReset = now;
    return true; // Indique que les crédits ont été réinitialisés
  }

  return false; // Aucun réajustement
};

// Méthode pour utiliser un crédit
userSchema.methods.usePostCredit = function () {
  if (this.dailyPostCredits > 0) {
    this.dailyPostCredits -= 1;
    return true; // Crédit utilisé avec succès
  }
  return false; // Pas assez de crédits
};

// Nouvelle méthode pour ajouter des crédits achetés
userSchema.methods.addPurchasedCredits = async function (amount) {
  this.dailyPostCredits += amount;
  await this.save();
  return this;
};

const Users = mongoose.model("Users", userSchema);

export default Users;
