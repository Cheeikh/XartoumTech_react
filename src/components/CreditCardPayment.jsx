import React, { useState } from 'react';

const CreditCardPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de traitement du paiement
    console.log('Paiement soumis');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Set up your credit or debit card</h2>
      <div className="flex justify-center space-x-4 mb-6">
        <img src="/path/to/mastercard-logo.png" alt="Mastercard" className="h-8" />
        <img src="/path/to/paypal-logo.png" alt="PayPal" className="h-8" />
        <img src="/path/to/visa-logo.png" alt="Visa" className="h-8" />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Numéro de la carte"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Date expiration"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
        </div>
        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-between items-center mb-4">
          <span>100 Pièces de Jetons</span>
          <button className="text-purple-600">Change</button>
          <span className="font-bold">4000 XOF</span>
        </div>
        <div className="mb-4">
          <input type="checkbox" id="agree" className="mr-2" />
          <label htmlFor="agree">I agree</label>
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">
          Acheter
        </button>
      </form>
    </div>
  );
};

export default CreditCardPayment;