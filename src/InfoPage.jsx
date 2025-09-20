import React, { useState, useEffect } from "react";
import busData from "./data/BusData.json"; 
import "./InfoPage.css";

function InfoPage() {
  const [buses, setBuses] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  useEffect(() => {
    setBuses(busData);
  }, []);

  const toggleRoute = (route) => {
    setSelectedRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route]
    );
  };

  // 路線對應顏色（按鈕 & 卡片）
  const routeColorMap = {
    "紅線": "#e74c3c",
    "綠線": "#27ae60",
    "藍線": "#2980b9",
    "黃線": "#f1c40f",
    "橘線": "#e67e22",
    "紫線": "#8e44ad",
    "粉紅線": "#fd79a8",
    "灰線": "#aab7b8ff"
  };

  return (
    <div className="page-container">
      {/* 標題 */}
      <h1 className="info-title">園區公車資訊</h1>

      {/* 右上方按鈕 */}
      <div className="route-buttons">
        {buses.map((bus) => (
          <button
            key={bus.route}
            data-route={bus.route}       // CSS 顏色對應
            className={`route-btn ${
              selectedRoutes.includes(bus.route) ? "active" : ""
            }`}
            onClick={() => toggleRoute(bus.route)}
          >
            {bus.route}
          </button>
        ))}
      </div>

      {/* 被選取的公車資訊 */}
      <div className="bus-cards-container">
        {selectedRoutes.length === 0 ? (
          <p className="no-selection">
            點選上方按鈕以獲路線資訊
          </p>
        ) : (
          selectedRoutes.map((route) => {
            const bus = buses.find((b) => b.route === route);
            if (!bus) return null;
            return (
              <div
                key={bus.route}
                className="bus-card"
                data-route={bus.route}     // CSS 顏色對應
              >
                <h2>{bus.route}（{bus.start} → {bus.end}）</h2>
                <p><strong>營運時間：</strong>{bus.time}</p>
                <p><strong>發車間隔：</strong>{bus.interval}</p>
                <p><strong>路線描述：</strong>{bus.description}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default InfoPage;
