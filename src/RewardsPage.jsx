import React, { useState, useEffect } from "react";
import { useUser } from "./contexts/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

function RewardsPage({ lang }) {
  const rewards = [
    { id: 1, text_zh: "咖啡券", text_en: "Coffee Coupon", points: 30 },
    { id: 2, text_zh: "小點心", text_en: "Snack", points: 50 },
    { id: 3, text_zh: "電影票", text_en: "Movie Ticket", points: 200 },
    { id: 4, text_zh: "購物禮券", text_en: "Shopping Voucher", points: 100 },
    { id: 5, text_zh: "電子產品折扣", text_en: "Electronics Discount", points: 300 },
  ];

  const { user, profile, setProfile } = useUser(); // 使用 Context
  const [redeemedIds, setRedeemedIds] = useState(() => {
    const saved = localStorage.getItem("redeemedIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState("progress"); // "progress" 或 "list"

  useEffect(() => {
    localStorage.setItem("redeemedIds", JSON.stringify(redeemedIds));
  }, [redeemedIds]);

  // 兌換獎勵
  const redeem = async (reward) => {
    if (!profile || !user) return;

    if (profile.scores >= reward.points && !redeemedIds.includes(reward.id)) {
      const newScore = profile.scores - reward.points;

      // 更新 Firestore
      const userRef = doc(db, "profiles", user.uid);
      await updateDoc(userRef, { scores: newScore });

      // 更新 Context
      setProfile({ ...profile, scores: newScore });

      // 更新兌換紀錄
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
          <p>{lang === "zh" ? "你的分數: " : "Your Score: "} {profile?.scores || 0}</p>
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
                width: `${Math.min((profile?.scores || 0) % 30 / 30, 1) * 100}%`,
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
                  disabled={done || (profile?.scores || 0) < reward.points}
                  style={{
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: 6,
                    backgroundColor: done ? "#9e9e9e" : "#4caf50",
                    color: "#fff",
                    cursor: done || (profile?.scores || 0) < reward.points ? "not-allowed" : "pointer",
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
