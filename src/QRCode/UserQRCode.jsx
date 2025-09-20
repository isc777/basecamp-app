import { QRCodeCanvas } from "qrcode.react";

export default function UserQRCode({ profile }) {
  if (!profile) return null;

  // 🔹 想要提供的資訊，可以自由調整
  const userData = {
    name: profile.name,
    title: profile.title,
    years: profile.years,
    factory: profile.factory,
    phone: profile.phone,
    birthday: profile.birthday,
    email: profile.email,
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="font-semibold text-sm">我的 QR Code</h3>
      <QRCodeCanvas
        value={JSON.stringify(userData)} // 🔹 這裡可以放任意字串
        size={180}  // QR Code 大小
        bgColor="#ffffff"
        fgColor="#000000"
        level="Q"
        includeMargin={true}
      />
    </div>
  );
}
