import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/assets');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const upiPayload = "upi://pay?pa=tisnacarcare@upi&pn=Tisna%20Car%20Care&cu=INR&tn=Car%20Care%20Service%20Booking";

QRCode.toFile(
  path.join(targetDir, 'client-qr.png'),
  upiPayload,
  {
    width: 600,
    margin: 2,
    color: {
      dark: '#0B5E33', // Deep forest green QR modules matching theme
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H'
  },
  function (err) {
    if (err) throw err;
    console.log('✅ client-qr.png generated successfully at:', path.join(targetDir, 'client-qr.png'));
  }
);
