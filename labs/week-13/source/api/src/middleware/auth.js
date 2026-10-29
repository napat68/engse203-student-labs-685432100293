import { verifyToken } from '../services/authService.js';

export function authenticate(req, res, next) {
  // อ่าน Authorization Header
  const authorization = req.get('Authorization');

  // ต้องเป็น Bearer Token เท่านั้น
  const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');

  if (!match) {
    return res.status(401).json({
      error: 'ต้องเข้าสู่ระบบก่อน',
    });
  }

  const token = match[1];

  try {
    // ตรวจสอบลายเซ็นและวันหมดอายุของ JWT
    const payload = verifyToken(token);

    // เก็บข้อมูลผู้ใช้ไว้ให้ Middleware ถัดไปใช้งาน
    req.user = payload;

    next();
  } catch {
    // Token ปลอม ไม่ถูกต้อง หรือหมดอายุ
    return res.status(401).json({
      error: 'ต้องเข้าสู่ระบบก่อน',
    });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    // ตรวจสอบสิทธิ์จากข้อมูล JWT ที่ผ่าน authenticate แล้ว
    if (req.user?.role !== role) {
      return res.status(403).json({
        error: 'ไม่มีสิทธิ์ทำรายการนี้',
      });
    }

    next();
  };
}
