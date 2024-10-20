// src/pages/CustomOrderForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitCustomOrder } from '../redux/orderSlice';

const CustomOrderForm = ({ productId, onClose }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [desiredDate, setDesiredDate] = useState('');
  const [offer, setOffer] = useState(null);
  const [measurements, setMeasurements] = useState({
    bust: '', waist: '', hips: '', length: '', shoulder: '', sleeve: ''
  });

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('image', image);
    formData.append('desiredDate', desiredDate);

    const response = await dispatch(submitCustomOrder(formData));
    if (response.payload) {
      setOffer(response.payload);
      setStep(2);
    }
  };

  const handleAcceptOffer = () => {
    setStep(3);
  };

  const handleMeasurementChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  const handleSubmitMeasurements = (e) => {
    e.preventDefault();
    // Here you would dispatch an action to submit the measurements
    console.log("Measurements submitted:", measurements);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Commande personnalisée</h2>
            <input type="file" onChange={handleImageUpload} required className="mb-4" />
            <input 
              type="date" 
              value={desiredDate} 
              onChange={(e) => setDesiredDate(e.target.value)} 
              required 
              className="mb-4 w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Soumettre</button>
          </form>
        )}

        {step === 2 && offer && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Offre reçue</h2>
            <p>Date de livraison proposée : {offer.proposedDate}</p>
            <p>Prix : {offer.price} FCFA</p>
            <button onClick={handleAcceptOffer} className="w-full bg-green-500 text-white p-2 rounded mt-4">Accepter l'offre</button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmitMeasurements}>
            <h2 className="text-lg font-semibold mb-4">Vos mesures</h2>
            {Object.keys(measurements).map(key => (
              <input 
                key={key}
                type="number"
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={measurements[key]}
                onChange={handleMeasurementChange}
                required
                className="mb-2 w-full p-2 border rounded"
              />
            ))}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Soumettre les mesures</button>
          </form>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Commande confirmée</h2>
            <p>Merci pour votre commande. Nous vous contacterons bientôt.</p>
            <button onClick={onClose} className="w-full bg-gray-500 text-white p-2 rounded mt-4">Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrderForm;