// Supposons que ceci est dans un fichier comme creditController.js
import Users from '../models/userModel.js';

export const purchaseCredits = async (req, res) => {
    try {
      console.log("Requête reçue pour l'achat de crédits:", req.body);
      const { userId, creditAmount } = req.body;
      
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      console.log("Crédits avant mise à jour:", user.dailyPostCredits);
      
      await user.addPurchasedCredits(creditAmount);
      
      // Rechargez l'utilisateur pour vérifier la mise à jour
      const updatedUser = await Users.findById(userId);
      console.log("Crédits après mise à jour:", updatedUser.dailyPostCredits);
      
      res.status(200).json({ 
        message: "Crédits ajoutés avec succès", 
        newCreditBalance: updatedUser.dailyPostCredits 
      });
    } catch (error) {
      console.error("Erreur lors de l'achat de crédits:", error);
      res.status(500).json({ message: "Erreur lors de l'achat de crédits", error: error.message });
    }
  };


