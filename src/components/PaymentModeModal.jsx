import React, { useState } from 'react';
import { X , ChevronDown} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";



const PaymentModeModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('100 Piéces de jetons');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-primary rounded-lg p-6 w-[50vw] h-[75vh] ">
        <div className="flex justify-end items-center mb-4 ">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-10 mt-12">
          <p className="text-center text-2xl font-semibold">Choisissez votre mode de paiement</p>
          <div className="border border-purple-300 rounded-md p-2 flex justify-between items-center">
            <span>{selectedPlan}</span>
            <span className="text-purple-600 cursor-pointer">Changer <ChevronDown className='ml-1' size={20}/> </span>
          </div>
        </div>

        <div className="border-2 border-[#7e22ce7e] rounded-lg p-5">
          <p className="mb-2 text-center text-3xl font-semibold">Mode de paiement</p>
          <div className="flex justify-between items-center mx-12 mt-20">
            <Link to="/Checkout" className="cursor-pointer">
            <img src="https://play-lh.googleusercontent.com/-Mp3XW7uhwn3KGQxUKGPoc4MbA5ti-3-q23TgoVi9ujBgHWW5n4IySvlG5Exwrxsjw" alt="Wave" className="w-48 h-48 rounded-full shadow-md shadow-[#969696]" 
            />
            </Link>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8pijHfCS9uWoP4g1dxrAm7ac2TeK2WyYeA&s" alt="Orange Money" className="w-48 h-48 shadow-md shadow-[#969696] rounded-full " />
            <img src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png" alt="Credit Card" className="w-48 h-48 rounded-full shadow-md shadow-[#969696] " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModeModal;