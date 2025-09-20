import React, { useState, useEffect } from "react";
import busData from "./data/busData.json"; // 公車資料
import "./InfoPage.css";

function InfoPage() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // 模擬 fetch 公車資料
    setBuses(busData);
  }, []);

  return (
    <div className="page-container">
      {/* 公車資訊區 */}
      <section className="info-section">
        <h1>園區公車資訊</h1>
        <div className="bus-cards-container">
          {buses.map((bus, index) => (
            <div key={index} className="bus-card">
              <h2>{bus.route}（{bus.start} → {bus.end}）</h2>
              <p><strong>營運時間：</strong>{bus.time}</p>
              <p><strong>發車間隔：</strong>{bus.interval}</p>
              <p><strong>路線描述：</strong>{bus.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default InfoPage;
