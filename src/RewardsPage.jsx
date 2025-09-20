import React, { useState, useEffect } from "react";
import { useUser } from "./contexts/UserContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { motion } from "framer-motion";

function RewardsPage({ lang }) {
  const rewards = [
    { id: 1, text_zh: "咖啡券", text_en: "Coffee Coupon", points: 30 },
    { id: 2, text_zh: "小點心", text_en: "Snack", points: 50 },
    { id: 3, text_zh: "電影票", text_en: "Movie Ticket", points: 200 },
    { id: 4, text_zh: "購物禮券", text_en: "Shopping Voucher", points: 100 },
    { id: 5, text_zh: "電子產品折扣", text_en: "Electronics Discount", points: 300 },
  ];

  const { user, profile, setProfile } = useUser(); // Context
  const [redeemedIds, setRedeemedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("progress");
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const milestones = [50, 100, 250, 500]; // 里程碑分數

  // 點擊里程碑寶箱，領取額外獎勵
  const claimMilestone = async (score) => {
    if (!user || claimedMilestones.includes(score)) return;

    const rewardPoints = 20; // 額外獎勵分數
    const userRef = doc(db, "profiles", user.uid);
    
    await updateDoc(userRef, {
      scores: (profile.scores || 0) + rewardPoints,
      claimedMilestones: [...(profile.claimedMilestones || []), score],
    });

    setProfile({
      ...profile,
      scores: (profile.scores || 0) + rewardPoints,
      claimedMilestones: [...(profile.claimedMilestones || []), score]
    });

    setClaimedMilestones([...claimedMilestones, score]);

    alert(`🎉 你獲得額外 ${rewardPoints} 分！`);
  };


  // 初次載入：從 Firestore 抓 redeemedIds
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const userRef = doc(db, "profiles", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setRedeemedIds(data.redeemedIds || []);
      }
    };
    fetchData();
  }, [user]);

  // 兌換獎勵
  const redeem = async (reward) => {
    if (!profile || !user) return;

    if (profile.scores >= reward.points && !redeemedIds.includes(reward.id)) {
      const newScore = profile.scores - reward.points;
      const newRedeemedIds = [...redeemedIds, reward.id];

      const userRef = doc(db, "profiles", user.uid);
      // 一次更新兩個欄位
      await updateDoc(userRef, {
        scores: newScore,
        redeemedIds: newRedeemedIds,
      });

      // 更新 Context + 本地 state
      setProfile({ ...profile, scores: newScore });
      setRedeemedIds(newRedeemedIds);

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
                alignItems: "center",
                height: 50,
                width: 280,
                backgroundColor: "#eee",
                borderRadius: 15,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
            <div style={{ position: "relative", height: 50, backgroundColor: "#eee", borderRadius: 15, marginBottom: 20 }}>
              {/* 進度填充 */}
              <div style={{
                width: `${Math.min(profile?.scores / milestones[milestones.length-1], 1) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #4caf50, #00e676)",
                borderRadius: 15,
                transition: "width 0.5s ease-out",
              }} />

              {/* 寶箱里程碑 */}
              {milestones.map((score, i) => {
                const unlocked = profile?.scores >= score;
                const claimed = profile?.claimedMilestones?.includes(score); // 是否已經領過

                return (
                  <motion.span
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${Math.min(score / milestones[milestones.length - 1], 1) * 100}%`,
                      top: 0,
                      transform: "translateX(-80%)",
                      fontSize: 25,
                      cursor: unlocked ? "pointer" : "default",
                    }}
                    whileHover={unlocked && !claimed ? { scale: 1.3, rotate: -5 } : {}}
                    whileTap={unlocked && !claimed ? { scale: 0.9 } : {}}
                    animate={claimed ? { scale: [1.2, 0.8, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    onClick={() => unlocked && !claimed && claimMilestone(score)}
                  >
                  {/* 狀態顯示 */}
                  {claimed ? "📦" : "🎁"}
                  </motion.span>
                )
              })}
            </div>

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
