import React, { useState } from "react";
import { exploreData } from "./data/ExploreData.js"; // 確認檔名小寫
import "./ExplorePage.css"; // 你的自訂樣式
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
            className={`category-btn ${
              activeCategory === cat.key ? "active" : ""
            }`}
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
            title={item.title}
            desc={item.desc}
            phone={item.phone}
            time={item.time}
          />
        ))}
      </div>
    </div>
  );
  <div
  className={`p-5 rounded-2xl shadow-md ${
    category === 'office'
      ? 'bg-blue-50'
      : category === 'sport'
      ? 'bg-green-50'
      : category === 'leisure'
      ? 'bg-purple-50'
      : 'bg-yellow-50'
  }`}
></div>
}
