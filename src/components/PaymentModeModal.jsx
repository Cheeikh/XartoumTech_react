import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from "react-router-dom";

const PaymentModeModal = ({ isOpen, onClose }) => {
  // Utilisation d'un tableau pour stocker plusieurs forfaits sélectionnés
  const [selectedPlans, setSelectedPlans] = useState(['100 Piéces de jetons']);
  
  const plans = ['100 Piéces de jetons', '200 Piéces de jetons', '500 Piéces de jetons']; // Liste des plans disponibles

  const handlePlanChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedPlans(selectedOptions); // Met à jour les forfaits sélectionnés
  };

  const changePaymentMethod = (method) => {
    localStorage.setItem('selectedPaymentMethod', method);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[50vw] h-[75vh]">
        <div className="flex justify-end items-center mb-4">
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="mb-10 mt-2">
          <p className="text-center text-2xl font-semibold">Choisissez vos forfaits</p>
          
          {/* Sélecteur multiple pour les forfaits */}
          <select
            multiple
            value={selectedPlans}
            onChange={handlePlanChange}
            className="border border-purple-300 rounded-md p-2 w-full"
          >
            {plans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>

        <div className="border-2 border-[#7e22ce7e] rounded-lg p-5">
          <p className="mb-2 text-center text-3xl font-semibold">Mode de paiement</p>
          <div className="flex justify-between items-center mx-12 mt-20">
            <Link
              to="/Checkout"
              className="cursor-pointer"
              onClick={() => changePaymentMethod('wave')}
            >
              <img
                src="https://play-lh.googleusercontent.com/-Mp3XW7uhwn3KGQxUKGPoc4MbA5ti-3-q23TgoVi9ujBgHWW5n4IySvlG5Exwrxsjw"
                alt="Wave"
                className="w-48 h-48 rounded-full shadow-md shadow-[#969696]"
              />
            </Link>
            <Link
              to="/Checkout"
              className="cursor-pointer"
              onClick={() => changePaymentMethod('orangeMoney')}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8pijHfCS9uWoP4g1dxrAm7ac2TeK2WyYeA&s"
                alt="Orange Money"
                className="w-48 h-48 shadow-md shadow-[#969696] rounded-full"
              />
            </Link>
            <Link
              to="/Checkout"
              className="cursor-pointer"
              onClick={() => changePaymentMethod('creditCard')}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png"
                alt="Credit Card"
                className="w-48 h-48 rounded-full shadow-md shadow-[#969696]"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModeModal;
