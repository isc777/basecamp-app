import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner({ onScan, scanning }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scanning) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
      return;
    }

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      {
        fps: 20,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        disableFlip: false,
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          onScan(data);
          scannerRef.current.clear();
        } catch (e) {
          console.error("QR Code 不是 JSON 格式", e);
        }
      },
      () => {
        // 忽略掃描錯誤
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [scanning, onScan]);

  return <div id="reader" className="mt-2 w-64 h-64"></div>;
}
