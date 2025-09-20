import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

// ====== 資料 ======
const menuItems = {
  zh: [
    { title: "探索公司環境", path: "/explore" },
    { title: "認識公司資訊", path: "/info" },
    { title: "社交任務", path: "/social" },
    { title: "獎勵兌換", path: "/rewards" },
    { title: "設定與個人資訊", path: "/settings" },
  ],
  en: [
    { title: "Explore Environment", path: "/explore" },
    { title: "Company Info", path: "/info" },
    { title: "Social Tasks", path: "/social" },
    { title: "Rewards", path: "/rewards" },
    { title: "Settings & Profile", path: "/settings" },
  ],
};

const tasks_zh = [
  { title: "開通信箱", point: 10 },
  { title: "掃描 QR code 完成探索任務", point: 15 },
  { title: "找同梯吃飯", point: 20 },
  { title: "參加新人說明會", point: 30 },
  { title: "兌換咖啡券", point: 10 },
];

const tasks_en = [
  { title: "Open mailbox", point: 10 },
  { title: "Scan QR code to complete exploration", point: 15 },
  { title: "Have lunch with a colleague", point: 20 },
  { title: "Join orientation meeting", point: 30 },
  { title: "Redeem coffee coupon", point: 10 },
];

// ====== 任務列表元件 ======
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
          {completed.includes(task.title) ? "✅" : "⬜"} {task.title}
        </button>
      ))}
    </div>
  );
}

// ====== 主頁元件 ======
function Home({ lang }) {
  const items = menuItems[lang];
  return (
    <div className="home-container">
      <h1>TSMC BaseCamp</h1>
      <div className="menu-grid">
        {items.map((item, idx) => (
          <Link key={idx} to={item.path} className="menu-button">
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ====== 子頁模板 ======
function Page({ lang, title }) {
  const tasks = lang === "zh" ? tasks_zh : tasks_en;
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  const handleComplete = (task) => setScore(score + task.point);

  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="home-button" onClick={() => navigate("/")}>
        {lang === "zh" ? "🏠 主頁" : "🏠 Home"}
      </button>

      <h2>{title}</h2>
      <p>{lang === "zh" ? "分數" : "Score"}: {score}</p>
      <TaskList tasks={tasks} onComplete={handleComplete} />
      <button
        className="redeem-button"
        onClick={() => alert(lang === "zh" ? "🎉 兌換成功！" : "🎉 Redeemed!")}
        disabled={score < 30}
      >
        {lang === "zh" ? "兌換獎勵 (需30分)" : "Redeem Reward (30 pts)"}
      </button>
    </div>
  );
}

// ====== App 主組件 ======
function App() {
  const [lang, setLang] = useState("zh");

  return (
    <div className="app-root">
      <button
        className="lang-button"
        onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      >
        {lang === "zh" ? "切換到 English" : "Switch to 中文"}
      </button>

      <Routes>
        <Route path="/" element={<Home lang={lang} />} />
        <Route path="/explore" element={<Page lang={lang} title={lang === "zh" ? "探索公司環境" : "Explore Environment"} />} />
        <Route path="/info" element={<Page lang={lang} title={lang === "zh" ? "認識公司資訊" : "Company Info"} />} />
        <Route path="/social" element={<Page lang={lang} title={lang === "zh" ? "社交任務" : "Social Tasks"} />} />
        <Route path="/rewards" element={<Page lang={lang} title={lang === "zh" ? "獎勵兌換" : "Rewards"} />} />
        <Route path="/settings" element={<Page lang={lang} title={lang === "zh" ? "設定與個人資訊" : "Settings & Profile"} />} />
      </Routes>
    </div>
  );
}

// ====== App Wrapper ======
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
