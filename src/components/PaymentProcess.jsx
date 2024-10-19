import React, { useState } from 'react';
import { QrCode } from 'lucide-react';

const PaymentProcess = ({ totalAmount, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowQR(method === 'wave' || method === 'orange');
  };

  const handlePaymentCompletion = () => {
    setPaymentCompleted(true);
    onPaymentComplete();
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Choisissez votre mode de paiement</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handlePaymentMethodChange('wave')}
          className={`px-4 py-2 rounded-md ${paymentMethod === 'wave' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Wave
        </button>
        <button
          onClick={() => handlePaymentMethodChange('orange')}
          className={`px-4 py-2 rounded-md ${paymentMethod === 'orange' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
        >
          Orange Money
        </button>
        <button
          onClick={() => handlePaymentMethodChange('cash')}
          className={`px-4 py-2 rounded-md ${paymentMethod === 'cash' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Espèces à la livraison
        </button>
      </div>
      
      {showQR && (
        <div className="mb-4">
          <QrCode size={200} />
          <p className="mt-2">Scannez ce code QR pour effectuer le paiement de {totalAmount} FCFA</p>
        </div>
      )}
      
      {paymentMethod && (
        <button
          onClick={handlePaymentCompletion}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Confirmer le paiement
        </button>
      )}
      
      {paymentCompleted && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
          Xartoum Tech vous remercie de votre fidélité !
        </div>
      )}
    </div>
  );
};

export default PaymentProcess;