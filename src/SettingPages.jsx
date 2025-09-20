import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const provider = new GoogleAuthProvider();

// 🔹 多語系字典
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
  const [profile, setProfile] = useState(null); // Firestore 中的資料
  const [editingField, setEditingField] = useState(null);

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
          scores: 0,
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

    if (field === "years" || field === "phone") {
      newValue = value.replace(/\D/g, "");
    }

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
          {texts[lang].loginBtn}
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center space-y-2">
          <img
            src={profile?.photoURL || user.photoURL}
            alt="avatar"
            className="w-16 h-16 rounded-full mx-auto"
          />
          <h2 className="mt-3 text-lg font-bold">{renderField("name", "name")}</h2>
          <p className="text-sm text-gray-600">{profile?.email || user.email}</p>

          <div className="flex flex-col items-center space-y-1 mt-2">
            {renderField("title", "title")}
            {renderField("years", "years", "number")}
            {renderField("factory", "factory")}
            {renderField("phone", "phone", "tel")}
            {renderField("birthday", "birthday", "date")}
            {renderField("scores", "scores", "number")}
            <p>
              {texts[lang].scores}: {profile?.scores || "xx"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            {texts[lang].logoutBtn}
          </button>
        </div>
      )}
    </div>
  );
}
