// src/SocialPage.jsx
import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import { useUser } from "./contexts/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import QRScanner from "./QRCode/QRScanner";

function SocialPage({ lang }) {
  const { user, profile, setProfile } = useUser();

  const tasks_zh = [
    { id: 1, text: "跟主管開會", point: 10, requiresQRCode: true },
    { id: 2, text: "和人資吃午餐", point: 10, requiresQRCode: true },
    { id: 3, text: "共用辦公設備", point: 10 },
    { id: 4, text: "一起參加公司活動", point: 20 },
    { id: 5, text: "認識實習生", point: 20, requiresQRCode: true },
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
    { id: 1, text: "Have coffee with colleagues", point: 10, requiresQRCode: true },
    { id: 2, text: "Have lunch together", point: 10, requiresQRCode: true },
    { id: 3, text: "Share office equipment", point: 10 },
    { id: 4, text: "Participate in company events", point: 20 },
    { id: 5, text: "Get to know interns", point: 20, requiresQRCode: true },
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

  // 🔹掃描器控制
  const [scanning, setScanning] = useState(false);
  const [scanningTask, setScanningTask] = useState(null);

  useEffect(() => {
    setCompletedIds(profile?.completedIds || []);
  }, [profile]);

  // 🔹完成任務
  const handleComplete = async (task) => {
    if (!user || !profile) return;
    if (completedIds.includes(task.id)) return;

    const newScore = (profile.scores || 0) + task.point;
    const newCompletedIds = [...completedIds, task.id];

    const userRef = doc(db, "profiles", user.uid);
    await updateDoc(userRef, {
      scores: newScore,
      completedIds: newCompletedIds,
    });

    setProfile({
      ...profile,
      scores: newScore,
      completedIds: newCompletedIds,
    });

    setCompletedIds(newCompletedIds);
  };

  const handleScanQRCode = (task) => {
    setScanningTask(task);
    setScanning(true);
  };

  // 🔹掃描結果判斷
const handleQRScanResult = (data) => {
  if (!scanningTask) return;
  try {
    const parsed = typeof data === "string" ? JSON.parse(data) : data;

    // 先檢查這個任務是不是已經完成
    if (completedIds.includes(scanningTask.id)) {
      alert(lang === "zh" ? "任務已完成 ✅" : "Task already completed ✅");
      setScanningTask(null);
      setScanning(false);
      return;
    }

    // 檢查 title 條件
    const titleMap = {
      "跟主管開會": "主管",
      "和人資吃午餐": "人資",
      "認識實習生": "實習生",
    };

    const requiredTitle = titleMap[scanningTask.text];
    if (requiredTitle && parsed.title === requiredTitle) {
      handleComplete(scanningTask);
      alert(lang === "zh" ? "任務完成 ✅" : "Task Completed ✅");
    } else {
      alert(lang === "zh" ? "QR 資料不符合任務" : "QR data does not match task");
    }
  } catch (err) {
    alert(lang === "zh" ? "QR Code 格式錯誤" : "QR Code format error");
  }

  // 不論成功或失敗都結束掃描
  setScanningTask(null);
  setScanning(false);
};

  return (
    <div className="page-container" style={{ textAlign: "center" }}>
      <h2>{lang === "zh" ? "社交任務" : "Social Tasks"}</h2>
      <p>{lang === "zh" ? "完成與同梯互動的任務" : "Complete social tasks with colleagues"}</p>

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
          onScanQRCode={handleScanQRCode}
          lang={lang}
        />
      )}

      {/* 🔹統一掃描器控制 */}
      {scanning && scanningTask && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => {
              setScanning(false);
              setScanningTask(null);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg mb-4"
          >
            {lang === "zh" ? "停止掃描" : "Stop Scanning"}
          </button>

          <QRScanner scanning={scanning} onScan={handleQRScanResult} />
        </div>
      )}
    </div>
  );
}

export default SocialPage;
