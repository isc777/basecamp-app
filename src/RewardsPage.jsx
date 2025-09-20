import React, { useState, useEffect } from "react";

function RewardsPage({ lang }) {
  const rewards = [
    { id: 1, text_zh: "咖啡券", text_en: "Coffee Coupon", points: 30 },
    { id: 2, text_zh: "小點心", text_en: "Snack", points: 50 },
  ];

  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);
  const [redeemedIds, setRedeemedIds] = useState(() => {
    const saved = localStorage.getItem("redeemedIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState("progress"); // "progress" 或 "list"

  useEffect(() => {
    localStorage.setItem("score", score);
    localStorage.setItem("redeemedIds", JSON.stringify(redeemedIds));
  }, [score, redeemedIds]);

  const redeem = (reward) => {
    if (score >= reward.points && !redeemedIds.includes(reward.id)) {
      setScore(score - reward.points);
      setRedeemedIds((prev) => [...prev, reward.id]);
      alert(lang === "zh" ? "🎉 兌換成功！" : "🎉 Redeemed!");
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <h2>{lang === "zh" ? "獎勵頁面" : "Rewards Page"}</h2>

      {/* Tab 按鈕 */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("progress")}
          style={{
            marginRight: 10,
            backgroundColor: activeTab === "progress" ? "#4caf50" : "#eee",
            color: activeTab === "progress" ? "#fff" : "#000",
            padding: "8px 16px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {lang === "zh" ? "分數進度" : "Progress"}
        </button>
        <button
          onClick={() => setActiveTab("list")}
          style={{
            backgroundColor: activeTab === "list" ? "#4caf50" : "#eee",
            color: activeTab === "list" ? "#fff" : "#000",
            padding: "8px 16px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {lang === "zh" ? "可兌換獎勵" : "Reward List"}
        </button>
      </div>

      {/* Progress Tab */}
      {activeTab === "progress" && (
        <div>
          <p>{lang === "zh" ? "你的分數: " : "Your Score: "} {score}</p>
          <div
            style={{
              height: 25,
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: `${Math.min((score % 30) / 30, 1) * 100}%`,
                height: "100%",
                backgroundColor: "#4caf50",
                transition: "width 0.3s",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Reward List Tab */}
      {activeTab === "list" && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {rewards.map((reward) => {
            const done = redeemedIds.includes(reward.id);
            return (
              <li
                key={reward.id}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: done ? "#f6fff6" : "#fff",
                }}
              >
                <span>{lang === "zh" ? reward.text_zh : reward.text_en} - {reward.points} {lang === "zh" ? "分" : "pts"}</span>
                <button
                  onClick={() => redeem(reward)}
                  disabled={done || score < reward.points}
                  style={{
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: 6,
                    backgroundColor: done ? "#9e9e9e" : "#4caf50",
                    color: "#fff",
                    cursor: done || score < reward.points ? "not-allowed" : "pointer",
                  }}
                >
                  {done ? (lang === "zh" ? "已兌換" : "Redeemed") : (lang === "zh" ? "兌換" : "Redeem")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RewardsPage;