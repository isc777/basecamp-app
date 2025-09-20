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

  const routeColors = ["#65a6e6", "#f7b267", "#f79d84", "#84d9a8", "#d6a2e8"];

  const getColor = (route) => {
    const index = buses.findIndex((b) => b.route === route);
    return routeColors[index % routeColors.length];
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
        {selectedRoutes.map((route) => {
          const bus = buses.find((b) => b.route === route);
          if (!bus) return null;
          return (
            <div
              key={bus.route}
              className="bus-card"
              style={{ backgroundColor: getColor(bus.route) }}
            >
              <h2>
                {bus.route}（{bus.start} → {bus.end}）
              </h2>
              <p>
                <strong>營運時間：</strong>
                {bus.time}
              </p>
              <p>
                <strong>發車間隔：</strong>
                {bus.interval}
              </p>
              <p>
                <strong>路線描述：</strong>
                {bus.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InfoPage;
