# Week 10 — Node.js & Database Integration

## ข้อมูลผู้จัดทำ

- ชื่อ: นภัสประภา กุลสุทธิเสถียร
- รหัสนักศึกษา: 685432100293
- รายวิชา: ENGSE203
- หัวข้อ: Node.js & Database Integration

## วัตถุประสงค์

พัฒนาระบบ Campus Service Request ให้สามารถเชื่อมต่อ Node.js กับฐานข้อมูล SQLite ได้จริง โดยปรับ Service Layer จากเดิมที่จัดการข้อมูลแบบ JSON/In-Memory ให้ทำงานกับฐานข้อมูลเชิงสัมพันธ์ที่พัฒนาต่อจาก Week 09

## สิ่งที่ได้ดำเนินการ

### CP26 — เชื่อมต่อ SQLite จาก Node.js

เชื่อมต่อฐานข้อมูล `campus.db` ด้วย `DatabaseSync` จาก `node:sqlite` และเปิดใช้งาน Foreign Key ด้วยคำสั่ง

```sql
PRAGMA foreign_keys = ON;