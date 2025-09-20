import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";

function SocialPage({ lang }) {
  const tasks_zh = [
    { id: 1, text: "找同梯喝咖啡", point: 10 },
    { id: 2, text: "午餐一起吃", point: 10 },
    { id: 3, text: "共用辦公設備", point: 10 },
  ];
  
  const tasks_en = [
    { id: 1, text: "Have coffee with colleagues", point: 10 },
    { id: 2, text: "Have lunch together", point: 10 },
    { id: 3, text: "Share office equipment", point: 10 },
  ];
  
  const tasks = lang === "zh" ? tasks_zh : tasks_en;

  const [score, setScore] = useState(
    () => parseInt(localStorage.getItem("score")) || 0
  );
  const [completedIds, setCompletedIds] = useState(() => {
    const saved = localStorage.getItem("completedIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" 或 "completed"

  useEffect(() => {
    localStorage.setItem("score", score);
    localStorage.setItem("completedIds", JSON.stringify(completedIds));
  }, [score, completedIds]);

  const handleComplete = (task) => {
    if (!completedIds.includes(task.id)) {
      setScore((prev) => prev + task.point);
      setCompletedIds((prev) => [...prev, task.id]);
    }
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
          tasks={tasks.filter(task => completedIds.includes(task.id))} // 只顯示已完成的任務
          completedIds={completedIds}
          onComplete={() => {}} // 已完成任務不可再完成
        />
      )}

      {activeTab === "tasks" && (
        <TaskList
          tasks={tasks.filter(task => !completedIds.includes(task.id))} // 只顯示未完成任務
          completedIds={completedIds}
          onComplete={handleComplete} // 點完成就會加分並加入 completedIds
        />
      )}
    </div>
  );
}

export default SocialPage;