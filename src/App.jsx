import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import MailboxPage from "./MailboxPage";
import InfoPage from "./InfoPage";
import ExplorePage from "./ExplorePage";
import SocialPage from "./SocialPage";
import RewardsPage from "./RewardsPage";
import SettingPage from "./SettingPages";
import { UserProvider } from "./contexts/UserContext";

// ====== 資料 ======
const menuItems = {
  zh: [
    { title: "公司環境", path: "/explore" },
    { title: "交通資訊", path: "/info" },
    { title: "社交任務", path: "/social" },
    { title: "獎勵兌換", path: "/rewards" },
    { title: "個人資訊", path: "/settings" },
  ],
  en: [
    { title: "Environment", path: "/explore" },
    { title: "Transport Info", path: "/info" },
    { title: "Social Tasks", path: "/social" },
    { title: "Rewards", path: "/rewards" },
    { title: "Profile", path: "/settings" },
  ],
};

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
import icon1 from "./assets/icons/home_icon.png";
import icon2 from "./assets/icons/gift_icon.png";
import icon3 from "./assets/icons/setting_icon.png";

function Home({ lang }) {
  const items = menuItems[lang];

  const rows = [
    {
      title: lang === "zh" ? "公司生活" : "Company Life",
      items: items.slice(0, 2),
      icons: [icon1],
    },
    {
      title: lang === "zh" ? "社交獎勵" : "Social & Rewards",
      items: items.slice(2, 4),
      icons: [icon2],
    },
    {
      title: lang === "zh" ? "設定" : "Settings",
      items: items.slice(4, 5),
      icons: [icon3],
    },
  ];

  return (
    <div className="home-container">
      <h1>BaseCamp</h1>
      <div className="menu-container">
        {rows.map((row, idx) => (
          <div key={idx} className="menu-row-wrapper">
            <div className="menu-row-title">
              <div className="row-icons">
                {row.icons.map((icon, i) => (
                  <img key={i} src={icon} alt={`icon-${i}`} className="row-icon" />
                ))}
              </div>
              <span className="row-title-text">{row.title}</span>
            </div>
            <div className="menu-row">
              {row.items.map((item, i) => (
                <Link key={i} to={item.path} className="menu-button">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ====== 通用任務頁 ======
function Page({ lang, title, tasks }) {
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);

  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  const handleComplete = (task) => setScore(prev => prev + task.point);

  return (
    <div className="page-container">
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

// ====== App 元件 ======
function App() {
  const [lang, setLang] = useState("zh");

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/explore" element={<ExplorePage lang={lang} />} />
          <Route path="/info" element={<InfoPage lang={lang} />} />
          <Route path="/social" element={<SocialPage lang={lang} />} />
          <Route path="/rewards" element={<RewardsPage lang={lang} />} />
          <Route path="/settings" element={<SettingPage lang={lang} setLang={setLang} />} />
          <Route path="/mailbox" element={<MailboxPage />} />
        </Routes>

        {/* 固定底部按鈕 */}
        <div className="bottom-buttons">
          <button
            className="lang-button"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          >
            {lang === "zh" ? "English" : "中文"}
          </button>
          <Link to="/" className="home-button">
            {lang === "zh" ? "首頁" : "Home"}
          </Link>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
