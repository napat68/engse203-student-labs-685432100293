# ENGSE203 — LAB13 Evidence Report

**Student ID:** 685432100293  
**Week:** week-13  
**Topic:** Security and Authentication  
**Branch:** `lab/week-13`

## 1. Implementation

- **CP48:** Strict Input Validation และจำกัด JSON Payload ขนาด 10 KB
- **CP49:** Password Hashing ด้วย scrypt และตรวจสอบรหัสผ่านด้วย timingSafeEqual
- **CP50:** JWT Login Authentication
- **CP51:** Role-based Authorization สำหรับ PUT และ DELETE
- **CP52:** Environment Variables และการตรวจสอบ JWT_SECRET ใน Production

## 2. Test Results

ทดสอบด้วย Vitest และ Supertest

- Unit Tests: ผ่าน
- Integration Tests: ผ่าน
- Week 13 Checker: **23/23 รายการในห้องเรียน**

## 3. Security Verification

- HTTP 401: ไม่มี Token หรือ Token ไม่ถูกต้อง
- HTTP 403: Token ถูกต้อง แต่ไม่มีสิทธิ์เจ้าหน้าที่
- GET และ POST: Public Access
- PUT และ DELETE: Staff Only
- Password: จัดเก็บเป็น Hash แทน Plaintext
- JWT_SECRET: ไม่จัดเก็บค่าลับจริงใน Repository

## 4. Known Issues

Challenge เพิ่มเติม 4 รายการยังไม่ได้ดำเนินการ ได้แก่ Security Header, Login Rate Limiting, Frontend Authorization Header และ Render JWT Secret Generation

## 5. Submission

- Commit: `532f00b` (Implementation)
- Submission Type: Evidence Report
- Status: Ready for Review