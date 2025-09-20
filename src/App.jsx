import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// 假資料：中英文任務
const tasks_zh = [
  { title: "開通信箱", point: 10 },
  { title: "掃描 QR code 完成探索任務", point: 15 },
  { title: "找同梯吃飯", point: 20 },
  { title: "參加新人說明會", point: 30 }
];

const tasks_en = [
  { title: "Open mailbox", point: 10 },
  { title: "Scan QR code to complete exploration", point: 15 },
  { title: "Have lunch with a colleague", point: 20 },
  { title: "Join orientation meeting", point: 30 }
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

// 子頁面元件
function Explore({ lang }) {
  const tasks = lang === "zh" ? tasks_zh : tasks_en;
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);

  const handleComplete = (task) => {
    setScore(score + task.point);
  };

  return (
    <div className="page-container">
      <h2>{lang === "zh" ? "探索公司環境" : "Company Exploration"}</h2>
      <TaskList tasks={tasks} onComplete={handleComplete} />
      <p>{lang === "zh" ? "分數" : "Score"}: {score}</p>
    </div>
  );
}

function Social({ lang }) {
  return (
    <div className="page-container">
      <h2>{lang === "zh" ? "社交任務" : "Social Tasks"}</h2>
      <p>{lang === "zh" ? "完成與同梯互動的任務" : "Complete social tasks with colleagues"}</p>
    </div>
  );
}

function Rewards({ lang }) {
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);

  const redeem = () => {
    alert(lang === "zh" ? "🎉 兌換成功！" : "🎉 Redeemed!");
  };

  return (
    <div className="page-container">
      <h2>{lang === "zh" ? "獎勵兌換" : "Reward Redemption"}</h2>
      <p>{lang === "zh" ? "你的分數: " : "Your Score: "} {score}</p>
      <button
        className="redeem-button"
        onClick={redeem}
        disabled={score < 30}
      >
        {lang === "zh" ? "兌換獎勵 (需30分)" : "Redeem Reward (30 pts)"}
      </button>
    </div>
  );
}

function Info({ lang }) {
  return (
    <div className="page-container">
      <h2>{lang === "zh" ? "認識公司資訊" : "Company Info"}</h2>
      <p>{lang === "zh" ? "這裡可以放公司介紹、規章與公告" : "Company introduction, rules, announcements"}</p>
    </div>
  );
}

function Settings({ lang, setLang }) {
  return (
    <div className="page-container">
      <h2>{lang === "zh" ? "設定與個人資訊" : "Settings & Profile"}</h2>
      <button
        className="lang-button"
        onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      >
        {lang === "zh" ? "切換到 English" : "Switch to 中文"}
      </button>
    </div>
  );
}

// 主頁元件
function Home() {
  return (
    <div className="home-container">
      <h1>TSMC BaseCamp</h1>
      <div className="menu-grid">
        <Link to="/explore" className="menu-button">探索公司環境</Link>
        <Link to="/info" className="menu-button">認識公司資訊</Link>
        <Link to="/social" className="menu-button">社交任務</Link>
        <Link to="/rewards" className="menu-button">獎勵兌換</Link>
        <Link to="/settings" className="menu-button">設定與個人資訊</Link>
      </div>
    </div>
  );
}

// App 元件
function App() {
  const [lang, setLang] = useState("zh");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore lang={lang} />} />
        <Route path="/info" element={<Info lang={lang} />} />
        <Route path="/social" element={<Social lang={lang} />} />
        <Route path="/rewards" element={<Rewards lang={lang} />} />
        <Route path="/settings" element={<Settings lang={lang} setLang={setLang} />} />
      </Routes>
    </Router>
  );
}

export default App;
