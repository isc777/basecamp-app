import React, { useState } from "react";
import { exploreData } from "./data/ExploreData.js";
import "./ExplorePage.css";
import Card from "./components/Card";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("office");

  const categories = [
    { key: "office", label: "辦公場所" },
    { key: "sport", label: "運動設施" },
    { key: "leisure", label: "休閒場所" },
    { key: "food", label: "美食街" },
  ];

  return (
    <div className="explore-page">
      <h1>探索 Explore</h1>

      {/* 分類按鈕 */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`category-btn ${activeCategory === cat.key ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 顯示該分類卡片 */}
      <div className="cards-container">
        {exploreData[activeCategory].map((item, idx) => (
          <Card
            key={idx}
            category={activeCategory}
            title={item.title}
            desc={item.desc}
            phone={item.phone}
            time={item.time}
          />
        ))}
      </div>
    </div>
  );
}
