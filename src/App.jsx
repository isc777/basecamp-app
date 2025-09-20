import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

// 任務資料，中英文及分數
const tasks_zh = [
  { title: "開通信箱", point: 10 },
  { title: "掃描 QR code 完成探索任務", point: 15 },
  { title: "找同梯吃飯", point: 20 },
  { title: "參加新人說明會", point: 30 },
  { title: "兌換咖啡券", point: 10 }
];

const tasks_en = [
  { title: "Open mailbox", point: 10 },
  { title: "Scan QR code to complete exploration", point: 15 },
  { title: "Have lunch with a colleague", point: 20 },
  { title: "Join orientation meeting", point: 30 },
  { title: "Redeem coffee coupon", point: 10 }
];

// 任務列表元件
function TaskList({ tasks, onComplete }) {
  const [completed, setCompleted] = useState(
    () => JSON.parse(localStorage.getItem("completedTasks")) || []
  );

  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completed));
  }, [completed]);

  const toggleTask = (task) => {
    if (completed.includes(task.title)) return;
    setCompleted([...completed, task.title]);
    onComplete(task);
  };

  return (
    <div className="tasks-container">
      {tasks.map((task, i) => (
        <button
          key={i}
          className={`task-button ${completed.includes(task.title) ? "completed" : ""}`}
          onClick={() => toggleTask(task)}
          disabled={completed.includes(task.title)}
        >
          {completed.includes(task.title) ? "✅" : "⬜"} {task.title} ({task.point} pts)
        </button>
      ))}
    </div>
  );
}

// 主 App 元件
function App() {
  const [lang, setLang] = useState("zh");
  const [score, setScore] = useState(
    () => parseInt(localStorage.getItem("score")) || 0
  );

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  const tasks = lang === "zh" ? tasks_zh : tasks_en;

  const handleComplete = (task) => {
    setScore(score + task.point);
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>TSMC BaseCamp</h1>

        <button
          className="lang-button"
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        >
          {lang === "zh" ? "切換到 English" : "Switch to 中文"}
        </button>

        <h2>{lang === "zh" ? "分數" : "Score"}: {score}</h2>

        <TaskList tasks={tasks} onComplete={handleComplete} />

        <button
          className="redeem-button"
          onClick={() => alert("🎉 兌換成功！(Redeemed!)")}
          disabled={score < 30}
        >
          {lang === "zh" ? "兌換獎勵 (需30分)" : "Redeem Reward (30 pts)"}
        </button>
      </div>
    </div>
  );
}

// React 18 新寫法
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;