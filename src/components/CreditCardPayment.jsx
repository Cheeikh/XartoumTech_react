import React, { useState } from 'react';
import { IoIosCard } from "react-icons/io";


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
    <div className="bg-white p-8 rounded-lg shadow-md h-[85vh]">
      <h2 className="text-2xl  text-center font-bold mb-6">Set up your credit or debit card</h2>
      <div className="flex justify-center space-x-4 mb-6">
        <img src="https://w7.pngwing.com/pngs/397/885/png-transparent-logo-mastercard-product-font-mastercard-text-orange-logo.png" alt="Mastercard" className="h-8" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal" className="h-8" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEdRE4elIptBYNu_D2M6TxSKgXooAfkt0fRQ&s" alt="Visa" className="h-8" />
      </div>
      <form onSubmit={handleSubmit} className=" h-[80%] flex flex-col gap-4 px-5 py-5">
        <div className='flex relative '>
          <input
            type="text"
            placeholder="Numéro de la carte"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full h-16 p-2 mb-4 border rounded border-purple-600 outline-none"
          />
          <img src="https://cdn-icons-png.flaticon.com/512/5614/5614873.png" alt="icon carte bancaire" className='w-7 h-7 absolute top-5  right-10 '/>
        </div> 
        
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2 p-2 border rounded border-purple-600 relative">
            <input
              type="text"
              placeholder="Date expiration"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-2 rounded outline-none"
            />
            <img src="https://www.clipartmax.com/png/middle/212-2123338_date-time-and-place-date-icon-png-transparent.png" alt="icon date" className='w-7 h-7 absolute top-3  right-10 '/>
          </div>
          <div className="w-1/2 p-2 border rounded flex items-center border-purple-600 relative">
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full p-2 rounded outline-none"
            />
            <img src="https://icon2.cleanpng.com/20180518/yfj/avq5ivffi.webp" alt="icon cvc" className='w-7 h-7 absolute top-3  right-10 '/>
          </div>
        </div>
        <div className='flex relative '>
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-16 p-2 mb-4 border rounded border-purple-600 outline-none"
          />
          <img src="https://icons.veryicon.com/png/o/miscellaneous/bitisland-world/person-18.png" alt="" className='w-7 h-7 absolute bottom-10 right-10 '/>
        </div>
        <div className=" px-10 h-14 flex justify-between items-center mb-4 border border-purple-300 rounded-md p-2 bg-gray-200" >
          <div className="flex justify-between items-center  w-2/3 mr-2">
            <select name="" id="" className='w-full text-purple-600 font-semibold'>
              <option value="">Choisir un jeton</option>
              <option value="100">100 Pièces de Jetons</option>
              <option value="200">200 Pièces de Jetons</option>
              <option value="500">500 Pièces de Jetons</option>
              <option value="1000">1000 Pièces de Jetons</option>
              <option value="2000">2000 Pièces de Jetons</option>
            </select>
          </div>
          <hr className='-rotate-45 w-20 '/>
          <div className="flex justify-end items-center text-2xl w-1/3 p-0 text-right ml-2"> 
            <span className="font-bold ">4000 XOF</span></div>
        </div>
        <p className=" mb-2 text-[12px]"> 
        By checking the checkbox below, you agree to our Terms of Use, Privacy Statement, and that you are over 18. Xartoom will automatically continue your  membership and charge the membership fee to  your payment method until you cancel. You may cancel at any time to  avoid future charges.
        </p>
        <div className="flex justify-between  items-center">
          <div className="mb-4 w-1/3"> 
            <input type="checkbox" id="agree" className="mr-2 w-10 h-7 active:bg-primary active:text-green-800" />
            <label htmlFor="agree" className="text-2xl">I agree</label>
          </div>
          <div className='w-2/3 flex justify-end mb-5 '>
          <button type="submit" className="bg-purple-600 text-white p-2 rounded w-64 text-lg font-semibold">
            Acheter
          </button>
          </div>
        </div> 
        
      </form>
    </div>
  );
};

export default CreditCardPayment;