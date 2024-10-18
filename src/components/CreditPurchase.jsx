import React, { useState, useEffect } from 'react';
import { makeRequest } from '../axios';
import { Button, Card, CardContent, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel, FormControl, TextField, Snackbar } from '@mui/material';
import { CreditCard, PlusCircle, MinusCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from "react-redux";
import { updateUserCredits } from "../redux/userSlice";


const PaymentMethodDialog = ({ open, onClose, onSelectMethod, creditsToBuy, totalCost }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (event) => {
    setSelectedMethod(event.target.value);
    setPhoneNumber('');
    setCode('');
  };

  const handleConfirm = () => {
    if (selectedMethod && phoneNumber && code) {
      setShowConfirmation(true);
      setTimeout(() => {
        onSelectMethod(selectedMethod, phoneNumber, code);
        setShowConfirmation(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choisissez votre méthode de paiement</DialogTitle>
      <DialogContent>
        <p>Vous allez acheter {creditsToBuy} crédit(s) pour un total de {totalCost.toLocaleString()} FCFA</p>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="payment-method"
            name="payment-method"
            value={selectedMethod}
            onChange={handleChange}
          >
            <FormControlLabel 
              value="orange" 
              control={<Radio />} 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="https://seeklogo.com/images/O/orange-money-logo-8F2AED308D-seeklogo.com.png" alt="Orange Money Logo" style={{ width: '24px', marginRight: '10px' }} />
                  Payer avec Orange Money
                </div>
              }
            />
            <FormControlLabel 
              value="wave" 
              control={<Radio />} 
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="https://www.banque.sn/wp-content/uploads/2021/09/wave-1024x1024.png" alt="Wave Logo" style={{ width: '24px', marginRight: '10px' }} />
                  Payer avec Wave
                </div>
              }
            />
          </RadioGroup>
        </FormControl>
        {selectedMethod && (
          <div style={{ marginTop: '20px' }}>
            <TextField
              label="Numéro"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleConfirm} disabled={!selectedMethod || !phoneNumber || !code}>Confirmer</Button>
      </DialogActions>
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, loop: Infinity, ease: "linear" }}
              >
                <CheckCircle size={64} color="#4CAF50" />
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Paiement réussi !
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

const CreditPurchase = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const [currentCredits, setCurrentCredits] = useState(currentUser?.user.dailyPostCredits || 0);
  const [creditsToBuy, setCreditsToBuy] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const creditCost = 100; // Coût par crédit en FCFA

  useEffect(() => {
    if (currentUser?.user._id) {
      fetchCurrentCredits();
    }
  }, [currentUser]);

  const fetchCurrentCredits = async () => {
    try {
      const userId = currentUser?.user._id;
      const response = await makeRequest.get(`/credits/${userId}`);
      const credits = response.data.credits;
      setCurrentCredits(credits);
      dispatch(updateUserCredits(credits));
    } catch (error) {
      console.error('Erreur lors de la récupération des crédits:', error);
      setErrorMessage('Impossible de récupérer le solde de crédits.');
    }
  };

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

  const handleSelectPaymentMethod = async (method, phoneNumber, code) => {
    const userId = currentUser?.user._id;
  
    try {
      console.log(`Paiement sélectionné : ${method}, Numéro : ${phoneNumber}, Code : ${code}`);
      
      const response = await makeRequest.post('/credits', {
        userId,
        creditAmount: creditsToBuy
      });
  
      if (response.status === 200) {
        const newCreditBalance = response.data.newCreditBalance;
        setCurrentCredits(newCreditBalance);
        dispatch(updateUserCredits(newCreditBalance));
        setShowSuccessMessage(true);
        setCreditsToBuy(1);
      } else {
        throw new Error('Erreur lors de l\'achat de crédits');
      }
    } catch (error) {
      setErrorMessage('Erreur lors de l\'achat de crédits. Veuillez réessayer.');
      console.error('Erreur lors de l\'achat de crédits:', error);
    } finally {
      setIsDialogOpen(false);
    }
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
            Coût total : <span style={{ fontWeight: 'bold', color: '#3f51b5' }}>{(creditsToBuy * creditCost).toLocaleString()} FCFA</span>
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

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
        message="Crédits achetés avec succès !"
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
      />
    </div>
  );
};

export default CreditPurchase;
