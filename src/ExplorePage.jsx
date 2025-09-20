import React, { useState } from "react";
import { exploreData } from "./data/ExploreData.js";
import "./ExplorePage.css";
import Card from "./components/Card";

export default function ExplorePage({ lang }) {
  const [activeCategory, setActiveCategory] = useState("office");


  const categories = [
    { key: "office", label_zh: "辦公場所", label_en: "Office" },
    { key: "sport", label_zh: "運動設施", label_en: "Sports" },
    { key: "leisure", label_zh: "休閒場所", label_en: "Leisure" },
    { key: "food", label_zh: "美食街", label_en: "Food Court" },
  ];


  return (
    <div className="explore-page">
      <h1>{lang === "zh" ? "探索環境" : "Explore Environment"}</h1>

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
            {lang === "zh" ? cat.label_zh : cat.label_en}
          </button>
        ))}
      </div>

      {/* 顯示該分類卡片 */}
      <div className="cards-container">
        {exploreData[activeCategory].map((item, idx) => (
          <Card
            key={idx}
            category={activeCategory}
            title={lang === "zh" ? item.title_zh : item.title_en}
            desc={lang === "zh" ? item.desc_zh : item.desc_en}
            phone={item.phone}
            time={item.time}
          />
        ))}
      </div>
    </div>
  );
}
