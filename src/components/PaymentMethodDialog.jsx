import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@/components/ui/dialog';

const PaymentMethodDialog = ({ isOpen, onClose, onSelectMethod, creditsToBuy, totalCost }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Choisissez votre méthode de paiement</DialogTitle>
      <DialogContent>
        <p className="mb-4">Vous allez acheter {creditsToBuy} crédit(s) pour un total de {totalCost.toFixed(2)} €</p>
        <div className="flex flex-col gap-4">
          {/* Payer avec Orange Money */}
          <Button 
            onClick={() => onSelectMethod('orange')}

            className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-ascent-1 rounded-lg" // Adding rounded-lg class for radius
          >
            <img 
              src="data:image/png;base64,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" // Remplacez par le chemin de votre image
              alt="Orange Money" 
              className="mr-2 h-5 w-5" 
            />
            Payer 
          </Button>

          {/* Payer avec Wave */}
          <Button 
            onClick={() => onSelectMethod('wave')}

            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-ascent-1 rounded-lg" // Adding rounded-lg class for radius
          >
            <img 
              src="src/assets/photo/wave-1024x1024.png" // Remplacez par le chemin de votre image
              alt="Wave" 
              className="mr-2 h-5 w-5" 
            />
            Payer avec Wave
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" className="rounded-lg">Annule</Button>
      </DialogActions>
    </Dialog>
  );
};
export default PaymentMethodDialog;
