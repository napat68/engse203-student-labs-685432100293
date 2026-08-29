# ENGSE203 LAB 01 — Developer Environment & GitHub Repository Setup

## ผู้จัดทำ

- ชื่อ-นามสกุล: นภัสประภา กุลสุทธิเสถียร
- รหัสนักศึกษา: 685432100293
- Section: SEC1
- ระบบปฏิบัติการที่ใช้: Windows

## วัตถุประสงค์

LAB 01 เป็นการเตรียม Developer Environment สำหรับรายวิชา ENGSE203 และฝึกใช้งาน Node.js, npm, Git, GitHub รวมถึงการทำงานด้วย Branch, Commit, Push และ Pull Request

## วิธีรัน

```bash
npm install
npm run start
npm run check
```

## ผลลัพธ์ที่คาดหวัง

เมื่อรัน `npm run start` โปรแกรมจะแสดงชื่อ รหัสนักศึกษา ระบบปฏิบัติการ และ Node.js version ที่ใช้งานจริง

ตัวอย่างผลลัพธ์:

```text
Hello Napatprapa (685432100293) | OS: win32 | Node: v24.18.0
```

## Environment

- Operating System: Windows
- Node.js: v24.18.0
- Package Manager: npm
- Version Control: Git
- Repository Hosting: GitHub
- Editor: Visual Studio Code

## Evidence

หลักฐานการทดสอบประกอบด้วย:

- ตรวจสอบ Node.js version
- ตรวจสอบ npm version
- ตรวจสอบ Git version
- รัน `npm run start` สำเร็จ
- รัน `npm run check` ผ่าน
- ใช้งาน Branch `lab/week-01`
- สร้าง Pull Request และ Merge เข้า `main`

## Reflection

LAB 01 ทำให้เข้าใจกระบวนการทำงานด้วย Git และ GitHub มากขึ้น โดยแยกการพัฒนางานออกจาก `main` ด้วย Branch จากนั้นจึง Commit และ Push การเปลี่ยนแปลงขึ้น GitHub ก่อนสร้าง Pull Request เพื่อตรวจสอบและ Merge งานกลับเข้าสู่ Branch หลัก

## References & AI Assistance

- Source / Documentation: ENGSE203 LAB 01 course materials
- AI tool used: ChatGPT
- Used for: ช่วยอธิบายขั้นตอนการตั้งค่า LAB ตรวจสอบโครงสร้างไฟล์ และแนะนำขั้นตอน Git/GitHub
- My adaptation: ตรวจสอบและปรับข้อมูลให้ตรงกับ Environment และ Student Repository ที่ใช้งานจริง