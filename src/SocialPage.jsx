// src/SocialPage.jsx
import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import { useUser } from "./contexts/UserContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

function SocialPage({ lang }) {
  const { user, profile, setProfile } = useUser(); // 用 Context 取得目前登入使用者＋profile

  const tasks_zh = [
    { id: 1, text: "找同事喝咖啡(掃描QRCODE以完成任務)", point: 10 },
    { id: 2, text: "和同事吃午餐(掃描QRCODE以完成任務)", point: 10 },
    { id: 3, text: "共用辦公設備", point: 10 },
    { id: 4, text: "一起參加公司活動", point: 20 },
    { id: 5, text: "認識實習生(掃描QRCODE以完成任務)連結gmail", point: 20 },
    { id: 6, text: "分享工作經驗", point: 15 },
    { id: 7, text: "參與團隊會議並提出建議", point: 15 },
    { id: 8, text: "組織團隊建設活動", point: 25 },
    { id: 9, text: "參加公司志願者活動", point: 30 },
    { id: 10, text: "推薦優秀人才加入公司", point: 50 },
    { id: 11, text: "與同事合作完成專案", point: 40 },
    { id: 12, text: "參加跨部門合作", point: 35 },
    { id: 13, text: "完成編輯個人檔案", point: 15 },
  ];

  const tasks_en = [
    { id: 1, text: "Have coffee with colleagues", point: 10 },
    { id: 2, text: "Have lunch together", point: 10 },
    { id: 3, text: "Share office equipment", point: 10 },
    { id: 4, text: "Participate in company events", point: 20 },
    { id: 5, text: "Get to know interns", point: 20 },
    { id: 6, text: "Share work experience", point: 15 },
    { id: 7, text: "Attend team meetings and provide suggestions", point: 15 },
    { id: 8, text: "Organize team-building activities", point: 25 },
    { id: 9, text: "Join company volunteer activities", point: 30 },
    { id: 10, text: "Refer talented individuals to join the company", point: 50 },
    { id: 11, text: "Collaborate with colleagues to complete projects", point: 40 },
    { id: 12, text: "Participate in cross-departmental collaboration", point: 35 },
    { id: 13, text: "Complete and edit personal profile", point: 15 },
  ];

  const tasks = lang === "zh" ? tasks_zh : tasks_en;

  const [completedIds, setCompletedIds] = useState(profile?.completedIds || []);
  const [activeTab, setActiveTab] = useState("tasks");

  // 🔹Profile 有變化時，同步 completedIds
  useEffect(() => {
    setCompletedIds(profile?.completedIds || []);
  }, [profile]);

  // 🔹完成任務
  const handleComplete = async (task) => {
    if (!user || !profile) return;
    if (completedIds.includes(task.id)) return;

    const newScore = (profile.scores || 0) + task.point;
    const newCompletedIds = [...completedIds, task.id];

    // 更新 Firestore → profiles collection
    const userRef = doc(db, "profiles", user.uid);
    await updateDoc(userRef, {
      scores: newScore,
      completedIds: newCompletedIds,
    });

    // 更新 Context → 讓畫面同步刷新
    setProfile({
      ...profile,
      scores: newScore,
      completedIds: newCompletedIds,
    });

    // 更新本地 state
    setCompletedIds(newCompletedIds);
  };

  return (
    <div className="page-container" style={{ textAlign: "center" }}>
      <h2>{lang === "zh" ? "社交任務" : "Social Tasks"}</h2>
      <p>
        {lang === "zh" ? "完成與同梯互動的任務" : "Complete social tasks with colleagues"}
      </p>

      {/* Tab 按鈕 */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("tasks")}
          style={{
            marginRight: "10px",
            backgroundColor: activeTab === "tasks" ? "#4caf50" : "#eee",
            color: activeTab === "tasks" ? "#fff" : "#000",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {lang === "zh" ? "任務列表" : "Task List"}
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          style={{
            backgroundColor: activeTab === "completed" ? "#4caf50" : "#eee",
            color: activeTab === "completed" ? "#fff" : "#000",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {lang === "zh" ? "已完成任務" : "Completed Tasks"}
        </button>
      </div>

      {/* Tab 內容 */}
{activeTab === "completed" && (
  <TaskList
    tasks={tasks.filter((task) => completedIds.includes(task.id))}
    completedIds={completedIds}
    onComplete={() => {}}
    lang={lang}
  />
)}

{activeTab === "tasks" && (
  <TaskList
    tasks={tasks.filter((task) => !completedIds.includes(task.id))}
    completedIds={completedIds}
    onComplete={handleComplete}
    lang={lang}
  />
)}
    </div>
  );
}

export default SocialPage;
