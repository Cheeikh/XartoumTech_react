import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { clearCart } from '../redux/productSlice';
import { QRCodeSVG } from 'qrcode.react';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector(state => state.product);
  const user = useSelector(state => state.user);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('');
  const [region, setRegion] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    switch (deliveryZone) {
      case 'dakar-centre':
        return 1500;
      case 'dakar-banlieue-proche':
        return 2000;
      case 'dakar-banlieue-eloignee':
        return 3000;
      case 'regions':
        return 0; // Le client récupère au Sénégal Dem Dikk
      default:
        return 0;
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getDeliveryFee();
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowQR(method === 'Wave' || method === 'Orange Money');
    setPaymentComplete(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'Espèces à la livraison') {
      alert(`Commande passée ! Total à payer à la livraison : ${calculateTotal()} FCFA`);
    } else if (paymentComplete) {
      alert("Xartoum-tech vous remercie de votre fidélité !");
    } else {
      alert("Veuillez compléter le paiement avant de confirmer la commande.");
      return;
    }
    dispatch(clearCart());
    navigate('/');
  };

  // Simuler la vérification du paiement
  useEffect(() => {
    if (showQR) {
      const timer = setTimeout(() => {
        setPaymentComplete(true);
        alert("Paiement reçu ! Xartoum-tech vous remercie de votre fidélité !");
      }, 10000); // Simule un paiement après 10 secondes
      return () => clearTimeout(timer);
    }
  }, [showQR]);

  return (
    <Layout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Méthode de paiement</h2>
            <div className="space-y-2">
              {['Wave', 'Orange Money', 'Espèces à la livraison'].map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => handlePaymentMethodChange(method)}
                    className="mr-2"
                    required
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {(paymentMethod === 'Wave' || paymentMethod === 'Orange Money') && showQR && (
            <div className="text-center">
              <QRCodeSVG value={`${paymentMethod}-${calculateTotal()}`} />
              <p className="mt-2">Scannez ce code QR pour payer {calculateTotal()} FCFA</p>
              {paymentComplete && (
                <p className="text-green-600 font-bold mt-2">Paiement reçu !</p>
              )}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-2">Zone de livraison</h2>
            <select
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez une zone</option>
              <option value="dakar-centre">Dakar Centre</option>
              <option value="dakar-banlieue-proche">Dakar Banlieue Proche</option>
              <option value="dakar-banlieue-eloignee">Dakar Banlieue Éloignée</option>
              <option value="regions">Régions (Livraison au Sénégal Dem Dikk)</option>
            </select>
          </div>

          {deliveryZone === 'regions' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Détails de l'expédition</h2>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Région d'expédition"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nom complet du destinataire"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <div className="border-t pt-4">
            <p className="flex justify-between"><span>Sous-total:</span> <span>{calculateSubtotal()} FCFA</span></p>
            <p className="flex justify-between"><span>Frais de livraison:</span> <span>{getDeliveryFee()} FCFA</span></p>
            <p className="flex justify-between font-bold text-lg"><span>Total:</span> <span>{calculateTotal()} FCFA</span></p>
          </div>

          <button 
            type="submit" 
            className={`w-full ${paymentComplete || paymentMethod === 'Espèces à la livraison' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-400 cursor-not-allowed'} text-white px-6 py-2 rounded`}
            disabled={!paymentComplete && paymentMethod !== 'Espèces à la livraison'}
          >
            Confirmer la commande
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutPage;