import React, { useState } from 'react';

const WavePayment = () => {
    const [numero, setNumero] = useState('');
    const [name, setName] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Paiement soumis');
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-[80vh] bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-primary p-8 rounded-lg h-full w-full flex flex-col gap-5" >
                <h2 className="text-2xl font-semibold text-center mb-6">Entrer your payment informations</h2>

                {/* Wave Logo */}
                <div className="flex justify-center mb-4">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8pijHfCS9uWoP4g1dxrAm7ac2TeK2WyYeA&s" alt="Orange Money" className="w-20 h-20 rounded-full"/>
                </div>

                {/* Numero de Telephone */}
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Numéro de téléphone" 
                        value={numero} 
                        onChange={(e) => setNumero(e.target.value)} 
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                    <span className="absolute top-3 right-3 text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.29-2.607a1 1 0 01.955 0l7.29 2.607M5.2 9.6v4.9c0 .345.2.65.51.8a7.491 7.491 0 0012.58 0c.31-.15.51-.455.51-.8V9.6" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V12m0-6h0" />
                        </svg>
                    </span>
                </div>

                {/* Nom complet */}
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Nom complet" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                    <span className="absolute top-3 right-3 text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                    </span>
                </div>

                {/* Selected Plan */}
                <div className="flex justify-between items-center mb-6 p-3 border rounded-md bg-gray-100">
                    <span>100 Piéces de Jetons</span>
                    <div className="flex items-center text-purple-600 cursor-pointer">
                        <span className="mr-1">Change</span>
                        <span>4000 XOF</span>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6 text-sm text-gray-600">
                    <p>
                        By checking the checkbox below, you agree to our <a href="#" className="text-purple-600 underline">Terms of Use</a>, 
                        <a href="#" className="text-purple-600 underline"> Privacy Statement</a>, and that you are over 18.
                    </p>
                </div>

                {/* Agreement */}
                <div className="flex items-center mb-6">
                    <input type="checkbox" id="agree" className="mr-2"/>
                    <label htmlFor="agree" className="text-sm">I agree</label>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-300"
                >
                    Acheter
                </button>
            </form>
        </div>
    );
};

export default WavePayment;
