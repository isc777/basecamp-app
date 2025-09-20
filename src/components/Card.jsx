// src/components/Card.jsx
import React from "react";
import "./Card.css";

export default function Card({ category, title, desc, phone, time }) {
  return (
    <div className={`card ${category}`}>
      <h3>{title}</h3>
      <p>{desc}</p>
      <p>📞 {phone}</p>
      <p>🕒 {time}</p>
    </div>
  );
}
