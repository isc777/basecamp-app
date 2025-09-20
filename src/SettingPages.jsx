// src/components/Login.jsx
import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import UserQRCode from "./QRCode/UserQRCode";
import QRScanner from "./QRCode/QRScanner";

const provider = new GoogleAuthProvider();

export default function SettingPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Firestore 中的資料
  const [editingField, setEditingField] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "profiles", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }
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
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      } else {
        setProfile(userSnap.data());
      }
    } catch (error) {
      console.error("登入失敗", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("登出失敗", error);
    }
  };

  const handleEdit = async (field, value) => {
    if (!user) return;
    const userRef = doc(db, "profiles", user.uid);

    let newValue = value;

    // 🔹 限制只能數字
    if (field === "years" || field === "phone") {
      newValue = value.replace(/\D/g, ""); // 移除非數字
    }

    await updateDoc(userRef, { [field]: newValue });
    setProfile((prev) => ({ ...prev, [field]: newValue }));
    setEditingField(null);
  };

  const renderField = (field, label, type = "text") => {
    if (editingField === field) {
      return (
        <input
          type={type}
          value={profile?.[field] || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, [field]: e.target.value }))
          }
          onBlur={(e) => handleEdit(field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleEdit(field, e.target.value);
            }
          }}
          autoFocus
          className="border rounded px-2 py-1 w-full text-center"
        />
      );
    }
    return (
      <p
        className="text-xs text-gray-600 cursor-pointer"
        onClick={() => setEditingField(field)}
      >
        {profile?.[field] || label}
      </p>
    );
  };

  return (
    <div className="page-container">
      {!user ? (
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          使用 Google 登入
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center space-y-2">
          <img
            src={profile?.photoURL || user.photoURL}
            alt="avatar"
            className="w-16 h-16 rounded-full mx-auto"
          />
          <h2 className="mt-3 text-lg font-bold">
            {renderField("name", "name")}
          </h2>
          <p className="text-sm text-gray-600">{profile?.email || user.email}</p>

          <div className="flex flex-col items-center space-y-1 mt-2">
            {renderField("title", "title")}
            {renderField("years", "years", "number")}
            {renderField("factory", "factory")}
            {renderField("phone", "phone", "tel")}
            {renderField("birthday", "birthday", "date")}
          </div>

          {/* 🔹 按鈕：顯示 QRCode */}
          <button
            onClick={() => setShowQRCode((prev) => !prev)}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            {showQRCode ? "隱藏 QR Code" : "產生 QR Code"}
          </button>
          {showQRCode && <UserQRCode profile={profile} />}

          {/* 🔹 QR Code 掃描 */}
          <QRScanner onScan={setScannedData} />

          {/* 🔹 顯示掃描到的資料 */}
          {scannedData && (
            <div className="mt-2 p-3 bg-gray-100 rounded shadow w-64 mx-auto text-left text-xs">
              <h3 className="font-semibold mb-1">掃描到的資訊：</h3>
              <pre>{JSON.stringify(scannedData, null, 2)}</pre>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}
