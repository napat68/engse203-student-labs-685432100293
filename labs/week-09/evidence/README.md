# week-09 Evidence

## Relational Database & SQL (SQLite)

**Student:** นภัสประภา กุลสุทธิเสถียร
**Student ID:** 685432100293  
**Course:** ENGSE203 — Modern JavaScript Development  
**Week:** 09  
**Status:** Submitted  
**Test Status:** Pass  
**Submission Tag:** `lab-09-submission-v1`

---

## ผลการทำ LAB09

LAB09 เป็นการออกแบบฐานข้อมูลเชิงสัมพันธ์สำหรับระบบ Campus Service Request โดยใช้ SQLite แยกข้อมูลออกเป็น 2 ตารางหลัก ได้แก่ `users` และ `requests` ซึ่งมีความสัมพันธ์แบบ One-to-Many (1:N)

สิ่งที่ดำเนินการประกอบด้วย:

- ออกแบบตาราง `users` และ `requests`
- กำหนด Primary Key และ Foreign Key
- ใช้ `NOT NULL`, `UNIQUE` และ `CHECK` Constraint
- สร้างฐานข้อมูล `campus.db`
- เขียน SQL Query สำหรับค้นหาและจัดการข้อมูล
- ใช้ `JOIN` เพื่อเชื่อมข้อมูลคำร้องกับข้อมูลผู้แจ้ง
- ทดสอบ Constraint ของฐานข้อมูล
- ทำ Challenge ได้แก่ `GROUP BY`, `LEFT JOIN` และ `INDEX`

---

## ผลการตรวจสอบ

| รายการ | ผลลัพธ์ |
|---|---|
| In-Class CP17–CP21 | 11/11 PASS |
| Take-Home CP22–CP25 | 16/16 PASS |
| Challenge | 3/3 PASS |
| LAB09 Checker | **30/30 PASS** |
| Constraint Testing | **5/5 PASS** |

---

## Constraint Testing

ทดสอบ Constraint ทั้งหมด 5 กรณี ได้แก่:

1. FOREIGN KEY — ป้องกัน `requester_id` ที่ไม่มีอยู่ในตาราง `users`
2. CHECK — ป้องกันค่า `status` ที่ไม่อยู่ในค่าที่กำหนด
3. UNIQUE — ป้องกัน `email` ซ้ำ
4. UNIQUE / PRIMARY KEY — ป้องกัน `request id` ซ้ำ
5. NOT NULL — ป้องกันคำร้องที่ไม่มี `location`

ผลการทดสอบ: **ผ่าน 5/5 กรณี**

[ดูรายละเอียด Constraint Testing](../source/evidence/CONSTRAINT_TEST.md)

---

## Evidence Screenshots

### Database Schema

แสดง `campus.db` พร้อมตาราง `users` และ `requests` และโครงสร้างฐานข้อมูลใน `schema.sql`

[ดูภาพ schema-in-vscode.png](../source/evidence/images/schema-in-vscode.png)

### JOIN Result

แสดงผลการใช้ `JOIN` ระหว่างตาราง `requests` และ `users` โดยสามารถแสดงชื่อผู้แจ้งผ่านคอลัมน์ `requesterName`

[ดูภาพ join-result.png](../source/evidence/images/join-result.png)

---

## ไฟล์สำคัญ

- [`schema.sql`](../source/schema.sql) — โครงสร้างฐานข้อมูลและข้อมูลตั้งต้น
- [`queries.sql`](../source/queries.sql) — SQL Queries และ Challenge
- [`DATA_MODEL.md`](../source/DATA_MODEL.md) — เอกสารอธิบายการออกแบบฐานข้อมูล
- [`AI_USAGE.md`](../source/AI_USAGE.md) — เอกสารการใช้ AI
- [`CONSTRAINT_TEST.md`](../source/evidence/CONSTRAINT_TEST.md) — ผลการทดสอบ Constraint
- `campus.db` — ฐานข้อมูล SQLite ที่ใช้ใน LAB09

---

## สรุป

สามารถออกแบบและใช้งานฐานข้อมูลเชิงสัมพันธ์ด้วย SQLite ได้ โดยเข้าใจการใช้ Primary Key, Foreign Key, Constraint และ JOIN เพื่อรักษาความถูกต้องของข้อมูลและเชื่อมโยงข้อมูลระหว่างตาราง

**Final Result: LAB09 Checker 30/30**