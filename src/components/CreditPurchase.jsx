import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CreditCard, PlusCircle, MinusCircle } from 'lucide-react';

const PaymentMethodDialog = ({ open, onClose, onSelectMethod, creditsToBuy, totalCost }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choisissez votre méthode de paiement</DialogTitle>
      <DialogContent>
        <p>Vous allez acheter {creditsToBuy} crédit(s) pour un total de {totalCost.toFixed(2)} €</p>
        <Button 
          onClick={() => onSelectMethod('orange')}
          variant="contained" 
          style={{ backgroundColor: '#FF6600', color: 'white', marginTop: '10px', marginBottom: '10px' }}
          fullWidth
        >
          <img src="data:image/png;base64,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" alt="Orange Money Logo" style={{ width: '24px', marginRight: '10px' }} />
          Payer avec Orange Money
        </Button>
        <Button 
          onClick={() => onSelectMethod('wave')}
          variant="contained" 
          style={{ backgroundColor: '#1E90FF', color: 'white' }}
          fullWidth
        >
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOKxIPYZLqBJeKt2WTLZ3ZU-Z9nQkRBXPGJQ&s" alt="Wave Logo" style={{ width: '24px', marginRight: '10px' }} />
          Payer avec Wave
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

const CreditPurchase = ({ currentCredits, onPurchase }) => {
  const [creditsToBuy, setCreditsToBuy] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const creditCost = 0.99; // Coût par crédit en euros

  const handleIncrementCredits = () => {
    setCreditsToBuy(prev => prev + 1);
  };

  const handleDecrementCredits = () => {
    setCreditsToBuy(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSelectPaymentMethod = (method) => {
    console.log(`Paiement sélectionné : ${method}`);
    onPurchase(creditsToBuy, method);
    handleCloseDialog();
    setCreditsToBuy(1); // Réinitialiser après l'achat
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <Card>
        <CardHeader title="Acheter des Crédits" />
        <CardContent>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <p>
              Solde actuel : <span style={{ fontWeight: 'bold', color: '#3f51b5' }}>{currentCredits} crédits</span>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Button onClick={handleDecrementCredits} variant="outlined">
              <MinusCircle style={{ color: '#9B01D8' }} />
            </Button>
            <input
              type="number"
              value={creditsToBuy}
              onChange={(e) => setCreditsToBuy(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '60px', margin: '0 10px', textAlign: 'center' }}
            />
            <Button onClick={handleIncrementCredits} variant="outlined">
              <PlusCircle style={{ color: '#9B01D8' }} />
            </Button>
          </div>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            Coût total : <span style={{ fontWeight: 'bold', color: '#3f51b5' }}>{(creditsToBuy * creditCost).toFixed(2)} €</span>
          </p>
          <Button
            onClick={handleOpenDialog}
            variant="contained"
            fullWidth
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#9B01D8', color: 'white' }}
          >
            <CreditCard style={{ marginRight: '10px' }} />
            Acheter {creditsToBuy} crédit{creditsToBuy > 1 ? 's' : ''}
          </Button>
        </CardContent>
      </Card>

      <PaymentMethodDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSelectMethod={handleSelectPaymentMethod}
        creditsToBuy={creditsToBuy}
        totalCost={creditsToBuy * creditCost}
      />
    </div>
  );
};

export default CreditPurchase;
