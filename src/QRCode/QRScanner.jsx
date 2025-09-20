import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const qrRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanning) return;
    const qrScanner = new Html5Qrcode("reader");

    qrScanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            onScan(data);
            qrScanner.stop();
            setScanning(false);
          } catch (e) {
            console.error("QR Code 不是 JSON 格式", e);
          }
        },
        (errorMessage) => {
          // console.log(errorMessage)
        }
      )
      .catch((err) => console.error(err));

    return () => {
      qrScanner.stop().catch(() => {});
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setScanning((prev) => !prev)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        {scanning ? "關閉掃描" : "開啟相機掃描"}
      </button>
      <div id="reader" className="mt-2 w-64 h-64"></div>
    </div>
  );
}
