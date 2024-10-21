import { Link } from "react-router-dom";
import React from 'react';

const CoinHistory = () => {
  const history = [
    { id: 1, icon: "https://play-lh.googleusercontent.com/-Mp3XW7uhwn3KGQxUKGPoc4MbA5ti-3-q23TgoVi9ujBgHWW5n4IySvlG5Exwrxsjw", amount: 50 ,montant:'2000 XOF', date: '6:39 PM', status: 'Done' },
    { id: 2, icon : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8pijHfCS9uWoP4g1dxrAm7ac2TeK2WyYeA&s",amount: 25 , montant:'1000 XOF', date: '3:09 AM', status: 'Done' },
    { id: 3, icon: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png", amount: 15, montant:'750 XOF', date: '5 days ago', status: 'Echec' },
    { id: 4, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8pijHfCS9uWoP4g1dxrAm7ac2TeK2WyYeA&s", amount: 50, montant:'2000 XOF', date: 'a week ago', status: 'Done' },
    { id: 5, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEdRE4elIptBYNu_D2M6TxSKgXooAfkt0fRQ&s", amount: 100,montant:'4000 XOF', date: 'a week ago', status: 'Echec' },
    { id: 6, icon: "https://play-lh.googleusercontent.com/-Mp3XW7uhwn3KGQxUKGPoc4MbA5ti-3-q23TgoVi9ujBgHWW5n4IySvlG5Exwrxsjw", amount: 50,montant:'2000 XOF', date: '2 weeks ago', status: 'Done' },
    { id: 7, icon: "https://w7.pngwing.com/pngs/397/885/png-transparent-logo-mastercard-product-font-mastercard-text-orange-logo.png", amount: 25, montant:'1000 XOF', date: 'a month', status: 'Done' },
    { id: 8, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8pijHfCS9uWoP4g1dxrAm7ac2TeK2WyYeA&s", amount: 15, montant:'750 XOF', date: 'a month', status: 'Echec' },
  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <Link to='/' className="mb-4 cursor-pointer flex items-center">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="Logo" className="w-7 h-7 mr-4 " />  
        <h2 className="text-xl font-bold ">Get Coins</h2>
        </Link>
      <input type="text" placeholder="Search" className="w-full p-2 mb-4 rounded-lg border-purple-600 border" />
      <ul className="space-y-2">
        {history.map((item) => (
          <li key={item.id} className="bg-white p-3 rounded-xl shadow-lg flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
                <div>
                    <img src={item.icon} alt="Icon" className="w-10 h-10 rounded-full  " />
                </div>
                <div className="flex flex-col items-center justify-center ">
                <span className="font-bold">{item.amount} Pièces</span>
                <span className="text-sm text-gray-500 ml-2">{item.montant}</span>
                </div>
            </div>
                <div className="flex flex-col items-center justify-center">
                <span className="text-sm text-purple-600 ml-2 font-semibold">{item.date}</span>
                <span className={`text-sm ${item.status === 'Done' ? 'text-green-500' : 'text-red-500'}`}>
                {item.status}
                </span>
                </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinHistory;