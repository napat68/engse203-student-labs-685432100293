import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserByEmail } from './requestService.js';
import { verifyPassword } from '../utils/password.js';

export function login(email, password) {
  // ค้นหาผู้ใช้จากอีเมล
  const user = findUserByEmail(email);

  // ต้องมีบัญชีและเป็นเจ้าหน้าที่เท่านั้น
  if (!user || user.role !== 'staff') {
    return null;
  }

  // ตรวจสอบรหัสผ่านจาก Password Hash
  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  // สร้าง JWT โดยไม่ใส่รหัสผ่านหรือ Password Hash
  const token = jwt.sign(
    {
      sub: String(user.id),
      name: user.name,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );

  // ส่งข้อมูลผู้ใช้เฉพาะส่วนที่เปิดเผยได้
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export function verifyToken(token) {
  // ตรวจสอบลายเซ็นและวันหมดอายุของ JWT
  return jwt.verify(token, config.jwtSecret);
}
