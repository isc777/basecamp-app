import React, { useState } from "react";

function SettingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      setMsg("登入成功！");
    } else {
      setMsg("登入失敗！");
    }
  };

  return (
    <div className="page-container">
      <h2>設定資訊</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="帳號" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="密碼" />
      <button onClick={handleLogin}>登入</button>
      <p>{msg}</p>
    </div>
  );
}

export default SettingPage;