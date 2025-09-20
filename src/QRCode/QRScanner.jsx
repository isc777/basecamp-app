import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const stoppingRef = useRef(false); // 防止同時 stop
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const readerId = "reader";

    const startScanner = async () => {
      const qrScanner = new Html5Qrcode(readerId);
      scannerRef.current = qrScanner;

      try {
        await qrScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              console.log("掃描結果:", data);
              onScan(data);

              // 掃描成功後自動停止鏡頭
              await stopScanner();
              setScanning(false);
            } catch (e) {
              console.error("QR Code 不是 JSON 格式", e);
            }
          },
          (errorMessage) => {
            // 可選 log
          }
        );
      } catch (err) {
        console.error("啟動 QRScanner 失敗", err);
        setScanning(false);
      }
    };

    const stopScanner = async () => {
      if (stoppingRef.current) return; // 已經在停止中
      stoppingRef.current = true;

      const qrScanner = scannerRef.current;
      if (!qrScanner) {
        stoppingRef.current = false;
        return;
      }

      try {
        const state = await qrScanner.getState();
        if (state === "SCANNING") {
          await qrScanner.stop();
        }
        await qrScanner.clear();
      } catch (err) {
        console.warn("停止/清理掃描器失敗", err);
      } finally {
        scannerRef.current = null;
        stoppingRef.current = false;
      }
    };

    if (scanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [scanning, onScan]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setScanning((prev) => !prev)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        {scanning ? "關閉掃描" : "開啟相機掃描"}
      </button>
      <div
        id="reader"
        className={`mt-2 w-64 h-64 bg-gray-100 rounded-lg ${
          scanning ? "" : "hidden"
        }`}
      ></div>
    </div>
  );
}
