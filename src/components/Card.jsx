import React from 'react';
import "./Card.css";

const Card = ({ title, desc, phone, time }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition transform duration-200 p-5">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{desc}</p>
      <div className="text-sm text-gray-500 space-y-1">
        <p>📞 電話：{phone}</p>
        <p>🕒 時間：{time}</p>
      </div>
    </div>
  );
};

export default Card;
