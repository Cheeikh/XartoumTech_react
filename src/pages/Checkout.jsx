import React, { useEffect, useState } from 'react';
import { CreditCardPayment } from '../components';
import { CoinHistory } from '../components';
import { TopBar } from '../components';
import WavePayment from '../components/WavePayment';
import OrangemoneyPayment from '../components/OrangemoneyPayment';

const Checkout = () => {
  const [activePaymentMethod, setActivePaymentMethod] = useState('creditCard');

  useEffect(() => {
    const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
    if (savedPaymentMethod) {
      setActivePaymentMethod(savedPaymentMethod);
    }
  }, []);

  const renderPaymentComponent = () => {
    switch (activePaymentMethod) {
      case 'creditCard':
        return <CreditCardPayment />;
      case 'wave':
        return <WavePayment />;
      case 'orangeMoney':
        return <OrangemoneyPayment />;
      default:
        return <CreditCardPayment />;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg">
      <div className="hidden md:block mb-10">
        <TopBar />
      </div>
      <div className="flex justify-between">
        <div className="w-1/3 mr-2">
          <CoinHistory />
        </div>
        <div className="w-2/3 h-[80vh] ml-2">
          {renderPaymentComponent()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
