import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import UserQRCode from "./QRCode/UserQRCode";
import QRScanner from "./QRCode/QRScanner";

const provider = new GoogleAuthProvider();

const texts = {
  zh: {
    loginBtn: "使用 Google 登入",
    logoutBtn: "登出",
    scores: "🏆 積分",
    name: "名字",
    title: "職稱",
    years: "年資",
    factory: "工廠",
    phone: "電話",
    birthday: "生日",
  },
  en: {
    loginBtn: "Sign in with Google",
    logoutBtn: "Logout",
    scores: "🏆 Scores",
    name: "Name",
    title: "Title",
    years: "Years",
    factory: "Factory",
    phone: "Phone",
    birthday: "Birthday",
  },
};

export default function SettingPage({ lang = "zh" }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "profiles", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setProfile(userSnap.data());
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);

      const userRef = doc(db, "profiles", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newProfile = {
          name: user.displayName || "",
          title: "",
          years: 0,
          factory: "",
          phone: "",
          birthday: "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          scores: 0,
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      } else setProfile(userSnap.data());
    } catch (err) {
      console.error("登入失敗", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("登出失敗", err);
    }
  };

  const handleEdit = async (field, value) => {
    if (!user) return;
    const userRef = doc(db, "profiles", user.uid);
    let newValue = value;
    if (field === "years" || field === "phone") newValue = value.replace(/\D/g, "");
    await updateDoc(userRef, { [field]: newValue });
    setProfile((prev) => ({ ...prev, [field]: newValue }));
    setEditingField(null);
  };

  const renderField = (field, labelKey, type = "text") => {
    const label = texts[lang][labelKey] || labelKey;
    if (editingField === field) {
      return (
        <input
          type={type}
          value={profile?.[field] || ""}
          onChange={(e) => setProfile((prev) => ({ ...prev, [field]: e.target.value }))}
          onBlur={(e) => handleEdit(field, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEdit(field, e.target.value)}
          autoFocus
          className="field-input"
        />
      );
    }
    return (
      <p className="field-text" onClick={() => setEditingField(field)}>
        {profile?.[field] || label}
      </p>
    );
  };

  return (
    <div className="page-container">
      {!user ? (
        <button className="login-btn" onClick={handleLogin}>{texts[lang].loginBtn}</button>
      ) : (
        <div className="card-container">
          {/* 名片頭貼 + 資訊 */}
          <div className="profile-header">
            <img src={profile?.photoURL || user.photoURL} alt="avatar" className="avatar"/>
            <div className="profile-info">
              <h2>{renderField("name", "name")}</h2>
              <p className="email">{profile?.email || user.email}</p>
              {renderField("title", "title")}
              {renderField("years", "years")}
              {renderField("factory", "factory")}
              {renderField("phone", "phone")}
              {renderField("birthday", "birthday")}
              <p>{texts[lang].scores}: {profile?.scores || 0}</p>
            </div>
          </div>

          {/* 按鈕區 */}
          <div className="card-buttons">
            <button onClick={() => setShowQRCode((prev) => !prev)}>
              {showQRCode ? "隱藏 QR Code" : "產生 QR Code"}
            </button>
            {showQRCode && <UserQRCode profile={profile} />}

            {/* 這裡的按鈕完全可以自己設計 */}
            <button
              onClick={() => setScanning((prev) => !prev)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              {scanning ? "停止掃描" : "開始掃描"}
            </button>

            {/* 掃描器元件 */}
            <QRScanner
              scanning={scanning}
              onScan={(data) => {
                console.log("掃描結果：", data);
                setScanning(false);
              }}
            />

            <button onClick={handleLogout}>{texts[lang].logoutBtn}</button>

          </div>
        </div>
      )}
    </div>
  );
}
