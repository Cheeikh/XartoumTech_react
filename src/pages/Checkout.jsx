import React from 'react';
import CreditCardPayment from './CreditCardPayment';

const Checkout = () => {
  return (
    <div className="flex">
      {/* <div className="w-1/3">
        <CoinHistory />
      </div> */}
      <div className="w-2/3">
        <CreditCardPayment />
      </div>
    </div>
  );
};

export default Checkout;